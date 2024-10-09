import { trim, validateAmount, validateEmail, validatePassword, validatePhoneNumber, validateUsername } from "../validate";

describe('validateAmount', () => {
	it('should throw an error if the input is not a number', () => {
		expect(() => validateAmount(NaN)).toThrowError('Invalid number');
		// @ts-expect-error Testing invalid input type
		expect(() => validateAmount('abc')).toThrowError('Invalid number');
		// @ts-expect-error Testing invalid input type
		expect(() => validateAmount(null)).toThrowError('Invalid number');
		// @ts-expect-error Testing invalid input type
		expect(() => validateAmount(undefined)).toThrowError('Invalid number');
	});
});
describe('validatePhoneNumber', () => {
	it('should throw an error if the phone number is less than 10 digits', () => {
		expect(() => validatePhoneNumber('123456789')).toThrowError('Phone number must be between 10 and 15 digits long and contain only numbers.');
	});

	it('should throw an error if the phone number is more than 15 digits', () => {
		expect(() => validatePhoneNumber('1234567890123456')).toThrowError('Phone number must be between 10 and 15 digits long and contain only numbers.');
	});

	it('should throw an error if the phone number contains non-digit characters', () => {
		expect(() => validatePhoneNumber('1234567890a')).toThrowError('Phone number must be between 10 and 15 digits long and contain only numbers.');
	});

	it('should trim and return the phone number if it is valid', () => {
		expect(validatePhoneNumber(' 1234567890 ')).toBe('1234567890');
	});
});

describe('validateEmail', () => {
	it('should throw an error if the email does not contain "@"', () => {
		expect(() => validateEmail('example.com')).toThrowError(			'Email must be in a valid format, e.g., user@example.com. It should not contain spaces and must include an "@" symbol and a domain.'
		);
	});

	it('should throw an error if the email does not contain a domain', () => {
		expect(() => validateEmail('example@')).toThrowError(
			'Email must be in a valid format, e.g., user@example.com. It should not contain spaces and must include an "@" symbol and a domain.'
		);
	});

	it('should throw an error if the email contains spaces', () => {
		expect(() => validateEmail('example @example.com')).toThrowError(
			'Email must be in a valid format, e.g., user@example.com. It should not contain spaces and must include an "@" symbol and a domain.'
		);
	});

	it('should trim and return the email if it is valid', () => {
		expect(validateEmail(' example@example.com ')).toBe('example@example.com');
	});
});

describe('validateUsername', () => {
	it('should throw an error if the username is less than 3 characters', () => {
		expect(() => validateUsername('ab')).toThrowError(
			'Username must be between 3 and 10 characters long and can only contain letters and numbers (a-z, A-Z, 0-9).'
		);
	});

	it('should throw an error if the username is more than 10 characters', () => {
		expect(() => validateUsername('abcdefghijk')).toThrowError(
			'Username must be between 3 and 10 characters long and can only contain letters and numbers (a-z, A-Z, 0-9).'
		);
	});

	it('should throw an error if the username contains special characters', () => {
		expect(() => validateUsername('abc$')).toThrowError(
			'Username must be between 3 and 10 characters long and can only contain letters and numbers (a-z, A-Z, 0-9).'
		);
	});

	it('should trim and return the username if it is valid', () => {
		expect(validateUsername(' username ')).toBe('username');
	});
});

describe('validatePassword', () => {
	it('should throw an error if the password is less than 8 characters', () => {
		expect(() => validatePassword('Pass1')).toThrowError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
		);
	});

	it('should throw an error if the password does not contain an uppercase letter', () => {
		expect(() => validatePassword('password1!')).toThrowError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
		);
	});

	it('should throw an error if the password does not contain a lowercase letter', () => {
		expect(() => validatePassword('PASSWORD1!')).toThrowError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
		);
	});

	it('should throw an error if the password does not contain a digit', () => {
		expect(() => validatePassword('Password!')).toThrowError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
		);
	});

	it('should throw an error if the password does not contain a special character', () => {
		expect(() => validatePassword('Password1')).toThrowError(
			'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character'
		);
	});

	it('should trim and return the password if it is valid', () => {
		expect(validatePassword(' Password1! ')).toBe('Password1!');
	});
});

describe('trim', () => {
	it('should trim whitespace from the beginning and end of a string', () => {
		expect(trim('  test  ')).toBe('test');
	});

	it('should return an empty string if the input is empty', () => {
		expect(trim('')).toBe('');
	});

	it('should return the same string if there is no whitespace to trim', () => {
		expect(trim('test')).toBe('test');
	});
});
