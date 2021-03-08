function createDataset(fields, constraints, sortFields) {
	var NOME_SERVICO = "RMwsDataServer";
	var CAMINHO_SERVICO = "com.totvs.WsDataServer";
	
	var dataset = DatasetBuilder.newDataset();
	
	try
	{
		var servico = ServiceManager.getServiceInstance(NOME_SERVICO);
		log.info("Servico: " + servico);
		var instancia = servico.instantiate(CAMINHO_SERVICO);
		log.info("Instancia: " + instancia);
		var ws = instancia.getRMIwsDataServer();	
		log.info("WS: " + ws);
		
		var serviceHelper = servico.getBean();
		var authService = serviceHelper.getBasicAuthenticatedClient(ws, "com.totvs.IwsDataServer", 'adminfluig', '!2018@Minha!');
		
		// Enviar dados pelo dataset
		var fieldsXml = "<DATASET>";		
		fieldsXml += "<FBORDEROAUTZ> ";
		fieldsXml += ValidaCampo("AUTORIZADO",  fields[0]);
		fieldsXml += ValidaCampo("DATAVALIDADE",  fields[1]);
		fieldsXml += ValidaCampo("IDEMPRESAFLUIG",  fields[2]);
		fieldsXml += ValidaCampo("IDFLUIG",  fields[3]);
		fieldsXml += "</FBORDEROAUTZ> ";
		fieldsXml += "</DATASET> ";
				  
		log.info("DataSet enviado para o TBC: " + fieldsXml);
		
		var result = authService.saveRecordEmail("FinBorderoAutzWfData", fieldsXml, parseContext(constraints), fields[4]);
		
		//O TBC retorna os valores da chave caso o registro tenha sido salvo,
		//caso contrário, a exceção ocorrida é enviada pelo mesmo retorno, porém
		//formatada entre linhas '==='
		if ((result != null) && (result.indexOf("===") != -1))
		{
			var msgErro = result.substring(0, result.indexOf("==="));			
			throw msgErro;
		}
		
		dataset.addColumn("RESULT");
		dataset.addRow(new Array(result));
		
		log.info("RESULT: " + result);		 		

		return dataset;
	}
    catch (e) 
    {
		if (e == null)	
			e = "Erro desconhecido, verifique o log do AppServer.";
		
		var mensagemErro = "Erro na comunicação com o TOTVS TBC: " + e;
		log.error(mensagemErro);
		
		dataset.addColumn("ERROR");
		dataset.addRow(new Array(mensagemErro));
		
		return dataset;
	}	
}

function ValidaCampo(campo, valor)
{
	if ((valor != null) && (valor != ""))
	{
		return "<"+campo+">"+valor+"</"+ campo + "> ";
	}
	else
		return "";
}

function parseContext(constraints)
{
	var context = "";
	if ((constraints != null) && (constraints.length > 0) && (constraints[0].getFieldName() == "RMSContext"))
		{
			context = constraints[0].getInitialValue();
		}
	
	return context;
}

// Transforma o conceito de constraints do Fluig para o Filtro do TBC.
function parseConstraints(constraints)
{
	var filter = "";
    for	each(con in constraints) {
    	
    	if (con.getFieldName().toUpperCase() == "RMSCONTEXT")
    		continue;
    	
    	filter += "(";
    	
    	if (con.getFieldName().toUpperCase() == "RMSFILTER")
		{
    		filter += con.getInitialValue();
		}
    	else if (con.getConstraintType() == ConstraintType.SHOULD)
		{
    		filter += "(";
			filter += con.getFieldName();
			filter += "=";
			filter += con.getInitialValue();			
			filter += ")";
			filter += " OR ";
			filter += "(";
			filter += con.getFieldName();
			filter += "=";
			filter += con.getFinalValue()();			
			filter += ")";
		}
    	else
		{
    		if (con.getInitialValue() == con.getFinalValue())
			{
				filter += con.getFieldName();
				
				if (ConstraintType.MUST == con.getConstraintType())
				{
					filter += " = ";
				}
				else if (ConstraintType.MUST_NOT == con.getConstraintType())
				{
					filter += " <> ";
				}
				
				filter += con.getInitialValue();
			}
    		else
			{
    			filter += con.getFieldName();
    			filter += " BETWEEN ";
    			filter += con.getInitialValue();
    			filter += " AND ";
    			filter += con.getFinalValue()
			}
		}
    	
		filter += ")";

		filter += " AND ";
	}
    
    if (filter.length == 0)
    {
    	filter = "1=1";    	
    }
    else
    	filter = filter.substring(0, filter.length-5);
    
    return filter;
}