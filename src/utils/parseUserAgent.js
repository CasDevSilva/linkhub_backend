import UAParser from "ua-parser-js";

export const parseUserAgent = (userAgentString) => {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    const deviceType = result.device.type || "desktop";

    return {
        device: deviceType,
        browser: result.browser.name || "Unknown",
        os: result.os.name || "Unknown"
    };
};