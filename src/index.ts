import { type OperationVariables, type FetchResult, type ApolloQueryResult, type TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery, type UseMutationOptions } from "@vue/apollo-composable";
import { type DocumentNode } from "graphql";
import { Ref, ref } from "vue";

type ReactiveFunction<TParam> = () => TParam;
type DocumentParameter<TResult, TVariables> = DocumentNode | Ref<DocumentNode | null | undefined> | ReactiveFunction<DocumentNode | null | undefined> | TypedDocumentNode<TResult, TVariables> | Ref<TypedDocumentNode<TResult, TVariables> | null | undefined> | ReactiveFunction<TypedDocumentNode<TResult, TVariables> | null | undefined>;
type VariablesParameter<TVariables> = TVariables | Ref<TVariables> | ReactiveFunction<TVariables>;

type ApolloSyncQueryArgs<TResult = any, TVariables extends OperationVariables = OperationVariables> = {
    document: DocumentParameter<TResult, TVariables>; // TIPO DEL DOCUMENTO COME DESCRITTO DA APOLLO - TResult (Risultato della query) e TVariables (variabili della query) sono sottotipi del documento
    variables?: VariablesParameter<TVariables>; // VARIABILI DELLA QUERY - Il sottotipo TVariables va a prendere i tipi del documento specifico
};

type ApolloSyncMutationArgs<TResult, TVariables> = {
    document: | DocumentNode
    | Ref<DocumentNode>
    | ReactiveFunction<DocumentNode>
    | TypedDocumentNode<TResult, TVariables>
    | Ref<TypedDocumentNode<TResult, TVariables>>
    | ReactiveFunction<TypedDocumentNode<TResult, TVariables>>; //TIPO DEL DOCUMENTO COME DESCRITTO DA APOLLO - TResult (Risultato della mutation) e TVariables (variabili della mutation) sono sottotipi del documento
    options:
    | (
        | UseMutationOptions<TResult, TVariables>
        | Ref<UseMutationOptions<TResult, TVariables>>
        | ReactiveFunction<UseMutationOptions<TResult, TVariables>>
    )
    | undefined; //LE OPZIONI DI UNA MUTATION, (FetchPolicy, Variables, Context...) i sottotipi TResult e TVariables riprendono i tipi del documento specifico quando assegnato
};


const nullableVariables = ref()

export default class ReQurvApollo {
    //#region QUERY
    public useAsyncQuery<TResult, TVariables extends OperationVariables>(
        args: ApolloSyncQueryArgs<TResult, TVariables>,
    ) {
        const enableQuery = ref(false);
        const {
            result,
            onResult,
            loading: queryLoading,
            onError,
        } = useQuery(args.document, args.variables ? args.variables : nullableVariables, () => ({
            enabled: enableQuery.value,
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }));

        const apolloQuery = () =>
            new Promise<ApolloQueryResult<TResult>>((resolve, reject) => {
            
                enableQuery.value = true;
                onResult(res => {
                    if (!res.loading) {
                        enableQuery.value = false;
                        if (!res.data && res.errors) {
                            reject(res.error);
                        }
                        resolve(res);
                    }
                });
                onError(err => {
                    enableQuery.value = false;
                    reject(err);
                });
            });

        return {
            result,
            apolloQuery,
            queryLoading,
        };
    }
    //#endregion

    //#region MUTATION
    public useAsyncMutation<TResult = any, TVariables extends OperationVariables = OperationVariables>(
        args: ApolloSyncMutationArgs<TResult, TVariables>,
    ): {
        apolloMutation: () => Promise<FetchResult<TResult, Record<string, any>, Record<string, any>>>;
        mutationLoading: Ref<boolean>;
    } {
        const { onDone, loading: mutationLoading, onError, mutate } = useMutation(args.document, args.options);

        const apolloMutation = () =>
            new Promise<FetchResult<TResult, Record<string, any>, Record<string, any>>>((resolve, reject) => {
                mutate();
                onDone(res => {
                    if (res.errors) {
                        reject(res.errors[0]);
                    }
                    resolve(res); 
                });
                onError(err => {
                    reject(err);
                });
            });

        return {
            apolloMutation,
            mutationLoading,
        };
    }
    //#endregion
}
