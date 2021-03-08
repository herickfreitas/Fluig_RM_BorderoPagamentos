function validateForm(form){
	var atividade = parseInt(getValue("WKNumState"));
	var prox_atividade = parseInt(getValue("WKNextState"));

	
	if (atividade == 1)
		{
		
		if (form.getValue('dt_validade') == '' && prox_atividade != 10 ) 
		{
			throw "Favor informar o campo 'Data de Validade'";
		}

	}
}