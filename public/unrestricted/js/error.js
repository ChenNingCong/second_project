function handleError(data) {
    if (typeof data == 'string') {
        alert(`Error:\n${data}`);
    }
    if (data.errors && data.errors.length > 0) {
        const message = data.errors.map(err => {
            const field = err.field.charAt(0).toUpperCase() + err.field.slice(1);
            return `${field}: ${err.message}`;
        }).join('\n');
        alert(`Error:\n${message}`);
    }
}