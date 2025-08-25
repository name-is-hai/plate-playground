import { ButtonElement } from '@/components/ui/button-node';
import { createPlatePlugin } from 'platejs/react';

export const ELEMENT_BUTTON = 'button';

export const ButtonPlugin = createPlatePlugin({
  key: ELEMENT_BUTTON,
  node: {
    isElement: true,
    component: ButtonElement,
  },
});
