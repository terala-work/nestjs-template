import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventBridgeService } from "./eventbridge.service";

@Module({
  imports: [ConfigModule],
  providers: [EventBridgeService],
})
export class AWSModule {}
