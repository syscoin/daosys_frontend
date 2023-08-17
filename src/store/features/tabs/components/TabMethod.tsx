import React, { FC, useCallback, useState, useMemo } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography } from "@mui/material";
import { AbiFunction } from "abitype";
import Button from "@/components/Button";

export type TabMethodProps = {
    details: AbiFunction;
    onCall: (
        params: { [key: string]: string },
        stateSetCallback: React.Dispatch<React.SetStateAction<{ [key: string]: string; }>>,
    ) => void;
};

export const TabMethod: FC<TabMethodProps> = ({ details, onCall }) => {
    const [results, setResults] = useState<{ [key: string]: string }>({});

    // Initialize the inputs state based on the details.inputs
    const initialInputs = useMemo(() => {
        return details.inputs.reduce((acc, param) => {
            acc[param.name as string] = '';
            return acc;
        }, {} as { [key: string]: string });
    }, [details.inputs]);

    const [inputs, setInputs] = useState(initialInputs);

    const handleCallProxy = useCallback(() => {
        onCall(inputs, setResults);
    }, [onCall, inputs]);

    // Updated onChange handler to use a function inside setState
    // to ensure we are working with the latest state
    const handleInputChange = (name: string, value: string) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    return (
        <Accordion>
            <AccordionSummary>
                <Typography variant="h6">
                    {details.name}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {details.inputs.length > 0 && details.inputs.map((param, index) => {
                    return (
                        <Box component="div" key={index}>
                            <Typography variant="body1">
                                {param.name} ({param.type})
                            </Typography>
                            <TextField
                                key={index}
                                label={param.name}
                                variant="outlined"
                                onChange={(e) => {
                                    handleInputChange(param.name as string, e.target.value);
                                }}
                            />
                        </Box>
                    );
                })}

                <Button onClick={handleCallProxy}>
                    Execute
                </Button>

                {Object.keys(results).length > 0 && (
                    <Box>
                        <Typography variant="h6">
                            Results
                        </Typography>
                        {Object.keys(results).map((key, index) => {
                            return (
                                <Typography key={index} variant="body1">
                                    {key}: {results[key]}
                                </Typography>
                            );
                        })}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};