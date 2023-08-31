import { Injectable } from "@nestjs/common";
import { OtelMethodCounter, Span } from "nestjs-otel";

@Injectable()
export class AppService {
  @OtelMethodCounter()
  @Span()
  getHello(): string {
    return this.format_message("World!");
  }

  @OtelMethodCounter()
  @Span("getHello-Msg")
  getHelloMsg(message: string): string {
    return this.format_message(message);
  }

  @OtelMethodCounter()
  @Span("format_message-custom")
  format_message(name: string): string {
    return `Hello ${name} from NestJS via Serverless`;
  }
}
