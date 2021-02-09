import React, { ReactElement, MouseEvent } from 'react';
import { iconNameType, Icon } from '../materialUI';
import { Button, buttonColorType } from './Button';

export { IconButton };

const ICON_BUTTON_SIZE = 40;

function IconButton(props: {
  buttonSize?: number;
  color?: buttonColorType;
  disabled?: boolean;
  hint: string;
  iconName: iconNameType;
  onClick: (event: MouseEvent) => void;
}): ReactElement {
  const style = buildStyle();

  return (
    <Button
      color={props.color}
      disabled={props.disabled}
      hint={props.hint}
      onClick={props.onClick}
      style={style.button}
    >
      <div style={style.iconContainer}>
        <Icon iconName={props.iconName} />
      </div>
    </Button>
  );

  function buildStyle() {
    const buttonSize = props.buttonSize || ICON_BUTTON_SIZE;

    return {
      button: {
        width: buttonSize,
        minWidth: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
      },
      iconContainer: {
        display: 'flex',
      },
    };
  }
}
