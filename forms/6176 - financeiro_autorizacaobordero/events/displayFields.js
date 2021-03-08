function displayFields(form, customHTML) {
	/* CONFIGURACOES */
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	var numAtividade = getValue("WKNumState");
	
	var mode = form.getFormMode();

	form.setValue('modo', mode);

	if (numAtividade != null) {
		form.setValue('numAtiv', numAtividade);
	}
}

