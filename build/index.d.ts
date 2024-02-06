import { type OperationVariables, type FetchResult, type ApolloQueryResult, type TypedDocumentNode } from "@apollo/client";
import { type UseMutationOptions } from "@vue/apollo-composable";
import { type DocumentNode } from "graphql";
import { Ref } from "vue";
type ReactiveFunction<TParam> = () => TParam;
type DocumentParameter<TResult, TVariables> = DocumentNode | Ref<DocumentNode | null | undefined> | ReactiveFunction<DocumentNode | null | undefined> | TypedDocumentNode<TResult, TVariables> | Ref<TypedDocumentNode<TResult, TVariables> | null | undefined> | ReactiveFunction<TypedDocumentNode<TResult, TVariables> | null | undefined>;
type VariablesParameter<TVariables> = TVariables | Ref<TVariables> | ReactiveFunction<TVariables>;
type ApolloSyncQueryArgs<TResult = any, TVariables extends OperationVariables = OperationVariables> = {
    document: DocumentParameter<TResult, TVariables>;
    variables?: VariablesParameter<TVariables>;
};
type ApolloSyncMutationArgs<TResult, TVariables> = {
    document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode> | TypedDocumentNode<TResult, TVariables> | Ref<TypedDocumentNode<TResult, TVariables>> | ReactiveFunction<TypedDocumentNode<TResult, TVariables>>;
    options: (UseMutationOptions<TResult, TVariables> | Ref<UseMutationOptions<TResult, TVariables>> | ReactiveFunction<UseMutationOptions<TResult, TVariables>>) | undefined;
};
export default class ReQurvApollo {
    private onErr;
    constructor(onErr?: () => void);
    useAsyncQuery<TResult, TVariables extends OperationVariables>(args: ApolloSyncQueryArgs<TResult, TVariables>): {
        apolloQuery: () => Promise<ApolloQueryResult<TResult>>;
        queryLoading: Ref<boolean>;
    };
    useAsyncMutation<TResult = any, TVariables extends OperationVariables = OperationVariables>(args: ApolloSyncMutationArgs<TResult, TVariables>): {
        apolloMutation: () => Promise<FetchResult<TResult, Record<string, any>, Record<string, any>>>;
        mutationLoading: Ref<boolean>;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map