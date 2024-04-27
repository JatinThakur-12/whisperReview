import crypto from "node:crypto"

export const generateOtp = (length:number = 6) => {

    if(length < 6){
        length=6;
    }
    const buffer = crypto.randomBytes(length); // Generate enough random bytes
    // console.log("Buffer:",buffer)
    const digits = Array.from(buffer, byte => (byte % 10).toString()).join(''); // Convert bytes to numbers
    // console.log("Digits:", digits)
    const otp = digits.slice(0, length); // Take the first 'length' digits
    return otp;
}