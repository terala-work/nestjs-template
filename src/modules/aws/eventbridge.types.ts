export type EventBridgeDetailType = string;

export interface IEventBridgeEvent<TDetailType extends EventBridgeDetailType, TDetail> {
  detailType: TDetailType;
  detail: TDetail;
}
