import { IconType } from "react-icons";

import {
  HiOutlineRocketLaunch,
  HiOutlineClock,
  HiOutlineBanknotes,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

export const iconLibrary: Record<string, IconType> = {
  rocket: HiOutlineRocketLaunch,
  instagram: FaInstagram,
  facebook: FaFacebook,
  time: HiOutlineClock,
  price: HiOutlineBanknotes,
  location: HiOutlineMapPin,
  phone: HiOutlinePhone,
  email: HiOutlineEnvelope,
  sun: HiOutlineSun,
  moon: HiOutlineMoon,
  menu: HiOutlineBars3,
  close: HiOutlineXMark,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;