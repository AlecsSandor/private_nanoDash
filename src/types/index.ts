import { IconNames } from "@components/SvgIcon";

export interface SidenavLinkData {
  title: string;
  path: string;
  icon: IconNames;
  id?: string;
  isBottomLink?: boolean;
}
