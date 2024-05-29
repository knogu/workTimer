// @generated by protoc-gen-es v1.9.0 with parameter "target=ts"
// @generated from file message.proto (package timer.gen, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message as Message$1, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from enum timer.gen.OperationType
 */
export enum OperationType {
  /**
   * @generated from enum value: SEND_MSG = 0;
   */
  SEND_MSG = 0,

  /**
   * @generated from enum value: RECEIPT_MSG = 1;
   */
  RECEIPT_MSG = 1,
}
// Retrieve enum metadata with: proto3.getEnumType(OperationType)
proto3.util.setEnumType(OperationType, "timer.gen.OperationType", [
  { no: 0, name: "SEND_MSG" },
  { no: 1, name: "RECEIPT_MSG" },
]);

/**
 * @generated from message timer.gen.GetOnlineReq
 */
export class GetOnlineReq extends Message$1<GetOnlineReq> {
  /**
   * @generated from field: string userId = 1;
   */
  userId = "";

  constructor(data?: PartialMessage<GetOnlineReq>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "timer.gen.GetOnlineReq";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "userId", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOnlineReq {
    return new GetOnlineReq().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOnlineReq {
    return new GetOnlineReq().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOnlineReq {
    return new GetOnlineReq().fromJsonString(jsonString, options);
  }

  static equals(a: GetOnlineReq | PlainMessage<GetOnlineReq> | undefined, b: GetOnlineReq | PlainMessage<GetOnlineReq> | undefined): boolean {
    return proto3.util.equals(GetOnlineReq, a, b);
  }
}

/**
 * @generated from message timer.gen.Message
 */
export class Message extends Message$1<Message> {
  /**
   * @generated from field: int64 fromUserId = 1;
   */
  fromUserId = protoInt64.zero;

  /**
   * @generated from field: int64 toUserId = 2;
   */
  toUserId = protoInt64.zero;

  /**
   * @generated from field: string content = 3;
   */
  content = "";

  constructor(data?: PartialMessage<Message>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "timer.gen.Message";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "fromUserId", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "toUserId", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "content", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Message {
    return new Message().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Message {
    return new Message().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Message {
    return new Message().fromJsonString(jsonString, options);
  }

  static equals(a: Message | PlainMessage<Message> | undefined, b: Message | PlainMessage<Message> | undefined): boolean {
    return proto3.util.equals(Message, a, b);
  }
}

/**
 * @generated from message timer.gen.Operation
 */
export class Operation extends Message$1<Operation> {
  /**
   * @generated from field: timer.gen.OperationType opType = 1;
   */
  opType = OperationType.SEND_MSG;

  /**
   * @generated from field: timer.gen.Message message = 2;
   */
  message?: Message;

  constructor(data?: PartialMessage<Operation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "timer.gen.Operation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "opType", kind: "enum", T: proto3.getEnumType(OperationType) },
    { no: 2, name: "message", kind: "message", T: Message },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Operation {
    return new Operation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Operation {
    return new Operation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Operation {
    return new Operation().fromJsonString(jsonString, options);
  }

  static equals(a: Operation | PlainMessage<Operation> | undefined, b: Operation | PlainMessage<Operation> | undefined): boolean {
    return proto3.util.equals(Operation, a, b);
  }
}

