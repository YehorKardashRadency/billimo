export enum TabType {
  Empty,
  Send,
  Receive,
}

export function parseTabType(tabType: string) {
  switch (tabType) {
    case 'Send':
      return TabType.Send;
    case 'Empty':
      return TabType.Receive;
    case 'Receive':
      return TabType.Receive;
    default:
      return undefined;
  }
}
