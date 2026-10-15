// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Leaving @Catch() empty catches all unhandled exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract or customize the message
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    } else if (exception instanceof Error) {
      // Handle custom error here if needed
      message = exception.message; 
    }

    // Send the customized, unified response back to the client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message, // Your customized message logic goes here
    });
  }
}