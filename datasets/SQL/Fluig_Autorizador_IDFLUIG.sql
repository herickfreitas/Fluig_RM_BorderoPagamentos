USE [corporerm]
GO

/****** Object:  UserDefinedFunction [dbo].[Fluig_Autorizador_IDFLUIG]    Script Date: 28/06/2021 12:05:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




ALTER FUNCTION [dbo].[Fluig_Autorizador_IDFLUIG]  

( @idfluig AS INT) 

RETURNS VARCHAR(30) 
AS

    BEGIN  

		DECLARE @Retorno AS varchar(30)

		if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001077] WHERE n_solicitacao = @idfluig) > 0) 
			/*	Solicitação de Autorização de Fornecimento	*/	
			SELECT @Retorno = autorizador FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001077] WHERE n_solicitacao = @idfluig

		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[TAR_PROCES] where num_proces = @idfluig and NUM_SEQ_ESCOLHID = 140) > 0)
			/*	Solicitação de Outras Entradas	- Escalar outro aprovador */	
			SELECT @Retorno = COD_MATR_ESCOLHID FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[TAR_PROCES] where num_proces = @idfluig and NUM_SEQ_ESCOLHID = 140

		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001078] WHERE n_solicitacao = @idfluig) > 0)
			/*	Solicitação de Outras Entradas	*/	
			SELECT @Retorno = autorizador FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001078] WHERE n_solicitacao = @idfluig

		
		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001080] WHERE n_solicitacao = @idfluig) > 0)
			/*	Solicitação de Pedido de Pagamento	*/	
			SELECT @Retorno = chefia FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001080] WHERE n_solicitacao = @idfluig


		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001085] WHERE n_solicitacao = @idfluig) > 0)
			/*	Parcelas de contratos */							
			SELECT @Retorno = 'PRESIDENTE - CONTRATO' /* gestorcc */ FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001085] WHERE n_solicitacao = @idfluig

							
		RETURN UPPER(@Retorno)

    END

GO


