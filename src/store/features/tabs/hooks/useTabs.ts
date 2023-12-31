import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useMemo } from "react";
import { Tab, addTab, removeTab as reduxRemoveTab } from "../tabsSlice";
import { v4 } from "uuid";

export const useTabs = () => {

    const dispatch = useAppDispatch();

    const tabs = useAppSelector(state => state.tabsSlice.tabs);



    const createTab = useCallback((tab: Tab) => {
        dispatch(addTab(tab));
    }, [dispatch]);

    const removeTab = useCallback((id: string) => {
        //@ts-ignore
        dispatch(reduxRemoveTab({ id }));
    }, [dispatch]);

    const newTab = useCallback(() => {
        const id = v4();
        createTab({
            id,
            title: 'New Tab',
            contractAddress: '',
        });

        let tabId = Math.max(...Object.keys(tabs).map(key => parseInt(key)));

        return tabId + 1;
    }, [createTab, tabs]);


    return useMemo(() => ({
        createTab,
        removeTab,
        tabs,
        newTab,
    }), [createTab, newTab, removeTab, tabs]);
}

export default useTabs;