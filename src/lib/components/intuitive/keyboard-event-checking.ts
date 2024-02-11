export function isSearchTypingEvent(event: KeyboardEvent): boolean {
    return event.key.length == 1 && (event.key >= 'a' && event.key <= 'z' || event.key >= 'A' && event.key <= 'Z');
}

export function isSearchOpenEvent(event: KeyboardEvent): boolean {
    return event.key === 'Enter' || isSearchTypingEvent(event);
}

export function isEscapeEvent(event: KeyboardEvent): boolean {
    return event.key === 'Escape';
}

export function isHideToggleEvent(event: KeyboardEvent): boolean {
    return event.key === ' ';
}

export function isNavLeftEvent(event: KeyboardEvent): boolean {
    return event.key === 'ArrowLeft';
}

export function isNavRightEvent(event: KeyboardEvent): boolean {
    return event.key === 'ArrowRight';
}