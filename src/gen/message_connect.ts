// @generated by protoc-gen-connect-es v1.4.0 with parameter "target=ts"
// @generated from file message.proto (package timer.gen, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { GetOnlineReq, Operation } from "./message_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service timer.gen.MessageService
 */
export const MessageService = {
  typeName: "timer.gen.MessageService",
  methods: {
    /**
     * @generated from rpc timer.gen.MessageService.Operations
     */
    operations: {
      name: "Operations",
      I: Operation,
      O: Operation,
      kind: MethodKind.BiDiStreaming,
    },
    /**
     * @generated from rpc timer.gen.MessageService.getOnline
     */
    getOnline: {
      name: "getOnline",
      I: GetOnlineReq,
      O: Operation,
      kind: MethodKind.ServerStreaming,
    },
  }
} as const;
