import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
const nullableVariables = ref();
export default class ReQurvApollo {
    onErr;
    constructor(onErr) {
        this.onErr = onErr;
    }
    //#region QUERY
    useAsyncQuery(args) {
        const enableQuery = ref(false);
        const { onResult, loading: queryLoading, onError, } = useQuery(args.document, args.variables ? args.variables : nullableVariables, () => ({
            enabled: enableQuery.value,
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }));
        const apolloQuery = () => new Promise((resolve, reject) => {
            enableQuery.value = true;
            onResult(res => {
                if (!res.loading) {
                    enableQuery.value = false;
                    if (!res.data && res.errors) {
                        if (this.onErr)
                            this.onErr();
                        reject(res.error);
                    }
                    resolve(res);
                }
            });
            onError(err => {
                enableQuery.value = false;
                if (this.onErr)
                    this.onErr();
                reject(err);
            });
        });
        return {
            apolloQuery,
            queryLoading,
        };
    }
    //#endregion
    //#region MUTATION
    useAsyncMutation(args) {
        const { onDone, loading: mutationLoading, onError, mutate } = useMutation(args.document, args.options);
        const apolloMutation = () => new Promise((resolve, reject) => {
            mutate();
            onDone(res => {
                if (res.errors) {
                    if (this.onErr)
                        this.onErr();
                    reject(res.errors[0]);
                }
                resolve(res);
            });
            onError(err => {
                if (this.onErr)
                    this.onErr();
                reject(err);
            });
        });
        return {
            apolloMutation,
            mutationLoading,
        };
    }
}
