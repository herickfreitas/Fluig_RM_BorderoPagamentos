USE [corporerm]
GO

/****** Object:  UserDefinedFunction [dbo].[Idmov_Fluig]    Script Date: 11/05/2021 18:05:04 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




/* funcao retorna a solicitação de Fluig de um movimento fazendo rastreamento, salvo que nossos movimentos só passam 1 vez
no fluig em seu ciclo de vida */

ALTER FUNCTION [dbo].[Idmov_Fluig]  

( @idmov AS INT) 

RETURNS INT 
AS

    BEGIN  
		
		DECLARE @Retorno AS INT
        select @Retorno = MIN(IDFLUIG) --MAX(IDFLUIG) 
		FROM TITMMOVWFLUIG 
		WHERE IDMOV IN(	SELECT DISTINCT IDMOV 
		FROM [dbo].[RASTREIAMOVIMENTOS_CNC] ( @idmov))
		
		
		if (@Retorno is null)
			SELECT @Retorno = IDFLUIG FROM TMOVCOMPL WHERE IDMOV = @idmov AND IDFLUIG IS NOT NULL
	
		
		RETURN @Retorno 

    END

GO


