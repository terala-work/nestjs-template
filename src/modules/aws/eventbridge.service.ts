import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IEventBridgeEvent } from "./eventbridge.types";

@Injectable()
export class EventBridgeService {
  private _ebc: EventBridgeClient;
  private _source: string;

  constructor(config: ConfigService) {
    this._source = config.getOrThrow<string>("eventBridge.source");
    this._ebc = new EventBridgeClient({ defaultsMode: "auto" });
  }

  public async publishEvent<TDetailType extends string, TDetail>(
    busName: string,
    event: IEventBridgeEvent<TDetailType, TDetail>,
  ): Promise<HttpStatus> {
    const input = {
      Entries: [
        {
          Time: new Date(),
          Source: this._source,
          DetailType: event.detailType,
          Detail: JSON.stringify(event.detail),
          EventBusName: busName,
        },
      ],
    };
    const command = new PutEventsCommand(input);
    const response = await this._ebc.send(command);
    return response.$metadata.httpStatusCode as HttpStatus;
  }
}
