'use client';

import { useState, useRef, useCallback } from 'react';

interface DragItem {
  id: string;
  index: number;
}

interface UseDragReorderOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T) => string;
}

export function useDragReorder<T>({ items, onReorder, getItemId }: UseDragReorderOptions<T>) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragStartIndex = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: T, index: number) => {
    dragStartIndex.current = index;
    setDraggedItem({ id: getItemId(item), index });
    
    // Set drag image (optional custom styling)
    const dragImage = e.currentTarget as HTMLElement;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragImage.outerHTML);
    
    // Make the dragged element semi-transparent
    setTimeout(() => {
      dragImage.style.opacity = '0.5';
    }, 0);
  }, [getItemId]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    setDraggedItem(null);
    setDragOverIndex(null);
    dragStartIndex.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (dragStartIndex.current === null || dragStartIndex.current === dropIndex) {
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[dragStartIndex.current];
    
    // Remove dragged item from its original position
    newItems.splice(dragStartIndex.current, 1);
    
    // Insert dragged item at new position
    const adjustedDropIndex = dragStartIndex.current < dropIndex ? dropIndex - 1 : dropIndex;
    newItems.splice(adjustedDropIndex, 0, draggedItem);
    
    onReorder(newItems);
    setDragOverIndex(null);
  }, [items, onReorder]);

  const handleTouchStart = useCallback((e: React.TouchEvent, item: T, index: number) => {
    dragStartIndex.current = index;
    setDraggedItem({ id: getItemId(item), index });
  }, [getItemId]);

  const handleTouchMove = useCallback((e: React.TouchEvent, index: number) => {
    if (!draggedItem) return;
    
    const touch = e.touches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementBelow) {
      const droppableElement = elementBelow.closest('[data-droppable="true"]');
      if (droppableElement) {
        const dropIndex = parseInt(droppableElement.getAttribute('data-index') || '0');
        setDragOverIndex(dropIndex);
      }
    }
  }, [draggedItem]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, dropIndex: number) => {
    if (!draggedItem || dragStartIndex.current === null) return;
    
    if (dragStartIndex.current !== dropIndex) {
      const newItems = [...items];
      const draggedItem = newItems[dragStartIndex.current];
      
      newItems.splice(dragStartIndex.current, 1);
      const adjustedDropIndex = dragStartIndex.current < dropIndex ? dropIndex - 1 : dropIndex;
      newItems.splice(adjustedDropIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
    dragStartIndex.current = null;
  }, [draggedItem, items, onReorder]);

  return {
    draggedItem,
    dragOverIndex,
    dragStartIndex: dragStartIndex.current,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  };
}
