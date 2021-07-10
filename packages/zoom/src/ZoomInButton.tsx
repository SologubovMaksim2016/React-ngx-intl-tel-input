/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import isMac from './utils/isMac';
import { RenderZoomInProps } from './ZoomIn';
import ZoomInIcon from './ZoomInIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ZoomInButton: React.FC<RenderZoomInProps> = ({ enableShortcuts, onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? l10n.zoom.zoomIn : 'Zoom in';
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+=' : 'Ctrl+=') : '';

    return (
        <Tooltip
            ariaControlsSuffix="zoom-in"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaKeyShortcuts={ariaKeyShortcuts} ariaLabel={label as string} onClick={onClick}>
                    <ZoomInIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default ZoomInButton;
