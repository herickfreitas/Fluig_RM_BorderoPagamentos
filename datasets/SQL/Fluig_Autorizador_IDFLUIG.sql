USE [Corporerm_Homolog]
GO

/****** Object:  UserDefinedFunction [dbo].[Fluig_Autorizador_IDFLUIG]    Script Date: 04/05/2021 16:22:19 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE FUNCTION [dbo].[Fluig_Autorizador_IDFLUIG]  

( @idfluig AS INT) 

RETURNS VARCHAR(20) 
AS

    BEGIN  

		DECLARE @Retorno AS varchar(20)

		if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001077] WHERE n_solicitacao = @idfluig) > 0) 
			/*	Solicitação de Autorização de Fornecimento	*/	
			SELECT @Retorno = autorizador FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001077] WHERE n_solicitacao = @idfluig

		
		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001078] WHERE n_solicitacao = @idfluig) > 0)
			/*	Solicitação de Outras Entradas	*/	
			SELECT @Retorno = autorizador FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001078] WHERE n_solicitacao = @idfluig

		
		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001080] WHERE n_solicitacao = @idfluig) > 0)
			/*	Solicitação de Pedido de Pagamento	*/	
			SELECT @Retorno = chefia FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001080] WHERE n_solicitacao = @idfluig


		else if ((SELECT count(*) FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001085] WHERE n_solicitacao = @idfluig) > 0)
			/*	Parcelas de contratos */							
			SELECT @Retorno = gestorcc FROM [RIOSRV013\SISTEMA].[FLUIG_DB].[dbo].[ML001085] WHERE n_solicitacao = @idfluig

							
		RETURN @Retorno 

    END

GO


