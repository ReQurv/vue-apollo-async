"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_composable_1 = require("@vue/apollo-composable");
var vue_1 = require("vue");
var nullableVariables = (0, vue_1.ref)();
var ReQurvApollo = /** @class */ (function () {
    function ReQurvApollo(onErr) {
        this.onErr = onErr;
    }
    //#region QUERY
    ReQurvApollo.prototype.useAsyncQuery = function (args) {
        var _this = this;
        var enableQuery = (0, vue_1.ref)(false);
        var _a = (0, apollo_composable_1.useQuery)(args.document, args.variables ? args.variables : nullableVariables, function () { return ({
            enabled: enableQuery.value,
            notifyOnNetworkStatusChange: false,
            fetchPolicy: "network-only",
        }); }), onResult = _a.onResult, queryLoading = _a.loading, onError = _a.onError;
        var apolloQuery = function () {
            return new Promise(function (resolve, reject) {
                enableQuery.value = true;
                onResult(function (res) {
                    if (!res.loading) {
                        enableQuery.value = false;
                        if (!res.data && res.errors) {
                            if (_this.onErr)
                                _this.onErr();
                            reject(res.error);
                        }
                        resolve(res);
                    }
                });
                onError(function (err) {
                    enableQuery.value = false;
                    if (_this.onErr)
                        _this.onErr();
                    reject(err);
                });
            });
        };
        return {
            apolloQuery: apolloQuery,
            queryLoading: queryLoading,
        };
    };
    //#endregion
    //#region MUTATION
    ReQurvApollo.prototype.useAsyncMutation = function (args) {
        var _this = this;
        var _a = (0, apollo_composable_1.useMutation)(args.document, args.options), onDone = _a.onDone, mutationLoading = _a.loading, onError = _a.onError, mutate = _a.mutate;
        var apolloMutation = function () {
            return new Promise(function (resolve, reject) {
                mutate();
                onDone(function (res) {
                    if (res.errors) {
                        if (_this.onErr)
                            _this.onErr();
                        reject(res.errors[0]);
                    }
                    resolve(res);
                });
                onError(function (err) {
                    if (_this.onErr)
                        _this.onErr();
                    reject(err);
                });
            });
        };
        return {
            apolloMutation: apolloMutation,
            mutationLoading: mutationLoading,
        };
    };
    return ReQurvApollo;
}());
exports.default = ReQurvApollo;
