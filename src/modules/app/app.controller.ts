import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
// import { EventBridgeService } from "../aws/eventbridge.service";
import { AppService } from "./app.service";

@ApiTags("app")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private readonly ebService: EventBridgeService,
  ) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/hello/:name")
  getHelloName(@Param("name") name: string): string {
    return this.appService.getHelloMsg(name);
  }

  @Get("/publish")
  getPublish(): void {
    // this.ebService.publishEvent;
  }
}
