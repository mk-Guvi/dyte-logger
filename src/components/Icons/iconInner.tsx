import { icons } from './icons';

const createMarkup = (markup: any) => {
  return { __html: markup };
};

export type IconTypeT = keyof typeof icons;
type iconInnerI = {
  icon: IconTypeT;
};

const IconInner = (props: iconInnerI) => {
  const iconMarkup = icons[props?.icon];

  if (iconMarkup) {
    return <g dangerouslySetInnerHTML={createMarkup(iconMarkup)} />;
  }
  return null;
};

export default IconInner;
