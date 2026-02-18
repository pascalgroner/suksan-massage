
import { useState } from "react";
import { Column, Flex, Text } from "@once-ui-system/core";

export const EnvVarItem = ({ name, value }: { name: string, value: string }) => {
    const isSensitive = name.includes("PASS") || name.includes("KEY") || name.includes("SECRET");
    const [isVisible, setIsVisible] = useState(false);
    
    return (
        <Column gap="xs" style={{ overflow: "hidden", minWidth: "300px", flex: 1 }}>
            <Text variant="label-default-s" onBackground="neutral-weak">{name}</Text>
            <Flex 
                gap="s" 
                vertical="center" 
                style={{ cursor: isSensitive ? "pointer" : "default" }}
                onClick={() => isSensitive && setIsVisible(!isVisible)}
            >
                <Text variant="body-strong-s" style={{ wordBreak: "break-all" }}>
                    {isSensitive && !isVisible ? "******" : (value || "Not Set")}
                </Text>
                {isSensitive && (
                    <Text variant="label-default-xs" onBackground="neutral-weak">
                        ({isVisible ? "Hide" : "Show"})
                    </Text>
                )}
            </Flex>
        </Column>
    );
}
