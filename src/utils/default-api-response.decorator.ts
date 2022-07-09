import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  ApiResponseOptions,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppErrorResponse } from './app-error.filter';
import { PaginatedResultDto } from './paginated-result.dto';

const SUCCESS_RESPONSE_DESC = 'Success response';

class DefaultException {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: any;

  @ApiProperty()
  error: string;
}

export function DefaultApiResponse(options: ApiResponseOptions) {
  return createResponseDecorators([
    ApiResponse({ description: SUCCESS_RESPONSE_DESC, ...options }),
  ]);
}

export function PaginatedApiResponse<TModel extends Type<any>>(model: TModel) {
  return createResponseDecorators(getPaginatedResponse(model));
}

function createResponseDecorators(decorators: Array<MethodDecorator & ClassDecorator>) {
  return applyDecorators(
    ...decorators,
    ApiBadRequestResponse({
      type: DefaultException,
      description: 'Format exception',
    }),
    ApiUnprocessableEntityResponse({
      type: AppErrorResponse,
      description: 'Business exception',
    }),
    ApiBearerAuth(),
  );
}

function getPaginatedResponse<TModel extends Type<any>>(model: TModel) {
  return [
    ApiExtraModels(PaginatedResultDto, model),
    ApiResponse({
      description: SUCCESS_RESPONSE_DESC,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            } as Record<keyof PaginatedResultDto<any>, SchemaObject | ReferenceObject>,
          },
        ],
      },
    }),
  ];
}
