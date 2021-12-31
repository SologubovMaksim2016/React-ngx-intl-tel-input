/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useMeasureRect } from './useMeasureRect';
import { useScroll } from './useScroll';
import { findNearest } from '../utils/findNearest';

interface ItemMeasurement {
    index: number;
    start: number;
    size: number;
    end: number;
    key: string;
}

interface Range {
    start: number;
    end: number;
}

const calculateRange = (measurements: ItemMeasurement[], outerSize: number, scrollOffset: number): Range => {
    const size = measurements.length - 1;
    const getOffset = (index: number) => measurements[index].start;
    let start = findNearest(0, size, scrollOffset, getOffset);
    let end = start;

    while (end < size && measurements[end].end < scrollOffset + outerSize) {
        end++;
    }

    return {
        start,
        end,
    };
};

export const useVirtual = ({
    estimateSize,
    numberOfItems,
    overscan,
    parentRef,
}: {
    estimateSize: (index: number) => number;
    numberOfItems: number;
    overscan: number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
}): {
    totalSize: number;
    virtualItems: ItemMeasurement[];
} => {
    const { scrollOffset } = useScroll({
        elementRef: parentRef,
    });
    const { height: parentHeight } = useMeasureRect({
        elementRef: parentRef,
    });

    const latestRef = React.useRef({
        scrollOffset: 0,
        measurements: [] as ItemMeasurement[],
        parentSize: 0,
        totalSize: 0,
    });
    latestRef.current.scrollOffset = scrollOffset;
    latestRef.current.parentSize = parentHeight;

    const measurements = React.useMemo(() => {
        const measurements: ItemMeasurement[] = [];

        for (let i = 0; i < numberOfItems; i++) {
            const start = measurements[i - 1] ? measurements[i - 1].end : 0;
            const size = estimateSize(i);
            const end = start + size;
            measurements[i] = {
                index: i,
                start,
                size,
                end,
                key: `${i}`,
            };
        }
        return measurements;
    }, [estimateSize]);

    const totalSize = measurements[numberOfItems - 1]?.end || 0;
    latestRef.current.measurements = measurements;
    latestRef.current.totalSize = totalSize;

    const { start, end } = calculateRange(
        latestRef.current.measurements,
        latestRef.current.parentSize,
        latestRef.current.scrollOffset
    );

    const startRange = Math.max(start - overscan, 0);
    const endRange = Math.min(end + overscan, measurements.length - 1);

    const virtualItems = [];
    for (let i = startRange; i <= endRange; i++) {
        virtualItems.push(measurements[i]);
    }
    return {
        totalSize,
        virtualItems,
    };
};
