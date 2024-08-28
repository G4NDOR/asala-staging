

export const getIpAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org');
        const ipAddress = await response.text();
        //console.log(`Your public IP address is: ${ipAddress}`);
        return ipAddress;
    } catch (error) {
        throw new Error('Failed to get IP address');
        return null;
    }
}
