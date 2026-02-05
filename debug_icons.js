import * as si from 'react-icons/si';
import * as fa from 'react-icons/fa';
import * as di from 'react-icons/di';

// Helper to safe check keys
const check = (obj, name) => {
    try {
        const keys = Object.keys(obj);
        return keys.filter(k =>
            k.toLowerCase().includes('microsoft') ||
            k.toLowerCase().includes('sql') ||
            k.toLowerCase().includes('database') ||
            k.toLowerCase().includes('server')
        );
    } catch (e) {
        return [`Error checking ${name}: ${e.message}`];
    }
}

console.log('--- SI Matches ---');
console.log(check(si, 'si'));

console.log('--- FA Matches ---');
console.log(check(fa, 'fa'));

console.log('--- DI Matches ---');
console.log(check(di, 'di'));
