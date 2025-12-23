// ===== Logger Utility =====
// A comprehensive logging system for the application

class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Store max 1000 logs in memory
        this.logLevels = {
            DEBUG: 'DEBUG',
            INFO: 'INFO',
            WARN: 'WARN',
            ERROR: 'ERROR'
        };
    }

    /**
     * Generate timestamp for logs
     */
    getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }

    /**
     * Create log entry
     */
    createLogEntry(level, message, data = null) {
        const logEntry = {
            timestamp: this.getTimestamp(),
            level: level,
            message: message,
            data: data,
            userAgent: navigator.userAgent
        };

        // Add to in-memory logs
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Log to browser console
        const consoleStyle = this.getConsoleStyle(level);
        console.log(`%c[${level}] ${logEntry.timestamp}: ${message}`, consoleStyle, data || '');

        return logEntry;
    }

    /**
     * Get console styling based on log level
     */
    getConsoleStyle(level) {
        const styles = {
            DEBUG: 'color: #2196F3; font-weight: bold;',
            INFO: 'color: #4CAF50; font-weight: bold;',
            WARN: 'color: #FF9800; font-weight: bold;',
            ERROR: 'color: #F44336; font-weight: bold;'
        };
        return styles[level] || '';
    }

    /**
     * Debug level logging
     */
    debug(message, data = null) {
        return this.createLogEntry(this.logLevels.DEBUG, message, data);
    }

    /**
     * Info level logging
     */
    info(message, data = null) {
        return this.createLogEntry(this.logLevels.INFO, message, data);
    }

    /**
     * Warning level logging
     */
    warn(message, data = null) {
        return this.createLogEntry(this.logLevels.WARN, message, data);
    }

    /**
     * Error level logging
     */
    error(message, data = null) {
        return this.createLogEntry(this.logLevels.ERROR, message, data);
    }

    /**
     * Get all logs
     */
    getAllLogs() {
        return this.logs;
    }

    /**
     * Get logs by level
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Export logs as JSON
     */
    exportLogsAsJSON() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Export logs as CSV
     */
    exportLogsAsCSV() {
        let csv = 'Timestamp,Level,Message,Data\n';
        this.logs.forEach(log => {
            csv += `"${log.timestamp}","${log.level}","${log.message}","${JSON.stringify(log.data || '')}"\n`;
        });
        return csv;
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        this.info('All logs cleared');
    }

    /**
     * Log specific action
     */
    logAction(action, details = {}) {
        const actionLog = {
            action: action,
            timestamp: this.getTimestamp(),
            details: details,
            userId: details.userId || null
        };
        this.info(`Action: ${action}`, actionLog);
        return actionLog;
    }

    /**
     * Download logs to file
     */
    downloadLogs(format = 'json') {
        let content = '';
        let filename = '';

        if (format === 'json') {
            content = this.exportLogsAsJSON();
            filename = `logs-${this.getTimestamp().split('T')[0]}.json`;
        } else if (format === 'csv') {
            content = this.exportLogsAsCSV();
            filename = `logs-${this.getTimestamp().split('T')[0]}.csv`;
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        this.info(`Logs downloaded as ${format.toUpperCase()}`);
    }

    /**
     * Get stats about logs
     */
    getStats() {
        const stats = {
            totalLogs: this.logs.length,
            debugCount: this.getLogsByLevel('DEBUG').length,
            infoCount: this.getLogsByLevel('INFO').length,
            warnCount: this.getLogsByLevel('WARN').length,
            errorCount: this.getLogsByLevel('ERROR').length
        };
        return stats;
    }

    /**
     * Print stats to console
     */
    printStats() {
        const stats = this.getStats();
        console.table(stats);
    }
}

// Create global logger instance
const logger = new Logger();

// Log application start
logger.info('Student-Teacher Appointment System initialized');
logger.info(`Browser: ${navigator.userAgent}`);
logger.info(`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

// Expose logger globally
window.logger = logger;

// Log unhandled errors
window.addEventListener('error', (event) => {
    logger.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString()
    });
});

// Log unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        promise: event.promise
    });
});
