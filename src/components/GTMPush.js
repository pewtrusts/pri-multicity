export function GTMPush(eventLabel) {
    var dataLayer = window.dataLayer || null;
    if (dataLayer) {
        dataLayer.push({ 'event': 'Interactive Click', 'eventData': eventLabel });
    }
}