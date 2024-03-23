import { pbkdf2, randomBytes } from 'crypto';

export function hashPassword(password: string): Promise<string> {
    const saltBytes = 32;
    const hashBytes = 16;
    const iterations = 100000;
    const algorithm = 'sha512';

    return new Promise((resolve, reject) => {
        randomBytes(saltBytes, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                // Hash the password with the generated salt
                pbkdf2(password, salt, iterations, hashBytes, algorithm, (err, key) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Combine salt and hash and convert to a hexadecimal string
                        const hashedPassword = `${salt.toString('hex')}:${key.toString('hex')}`;
                        resolve(hashedPassword);
                    }
                });
            }
        });
    });
}
