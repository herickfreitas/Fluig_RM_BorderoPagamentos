var NUMERO_START = 1;
var NUMERO_AUTORIZAR = 7;
var NUMERO_DESAUTORIZAR = 10;

function beforeStateEntry(sequenceId) {
	
	
	if (sequenceId == NUMERO_START) 
		{
		
		
		
		log.info("beforeStateEntry 1  ENTROU " );
		
	    //Recupera o numero da solicitação
		var processo = getValue("WKNumProces");
	    hAPI.setCardValue("n_solicitacao", processo);
	        
	    log.info("beforeStateEntry 1  processo " + processo);

		}

	    
	
	if ((sequenceId == NUMERO_AUTORIZAR) || (sequenceId == NUMERO_DESAUTORIZAR))
    {
		var companyId = 1;	    
	    try
	    {
	    	companyId = new java.lang.Integer(getValue("WKCompany"));     
	    }
	    catch(e)
	    {
	        log.info("Erro buscando o companyId: " + e);
	    }	
	 
		var cCompany = DatasetFactory.createConstraint("companyId", getValue("WKCompany"), getValue("WKCompany"), ConstraintType.MUST);		
		var cUser = DatasetFactory.createConstraint("colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);		
		var constraintsEmail = new Array(cCompany, cUser);
		var colleague = DatasetFactory.getDataset("colleague", null, constraintsEmail, null);
	    
		if (colleague.rowsCount > 0)
		{
			var Email = colleague.getValue(0, "mail");
			
		    var dt_validade = hAPI.getCardValue('dt_validade');
		
			var autorizado = 1;
		    if (sequenceId == NUMERO_DESAUTORIZAR)
		    	autorizado = 0;
		    
		    var fields = new Array(); 
		    fields.push(autorizado);
		    fields.push(dt_validade);
		    fields.push(companyId);	        
		    fields.push(new java.lang.Integer(getValue("WKNumProces")));
		    //fields.push(new java.lang.String(getValue("WKUser")));
		    fields.push(Email);
		
		    log.info("fields : " + fields);
		    datasetInsert = DatasetFactory.getDataset("rm_autoriza_borderopagamento", fields, null, null);
		    if (datasetInsert) 
		    {
		    	var error = datasetInsert.getValue(0, "ERROR");		
		    	if (error)
		    		throw error;
		    }
		    else
		    {
		    	throw "Webservice financeiro_autorizacaobordero com problema, favor contactar a equipe de suporte!";
		    }
		}
    }
}