/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "napi/native_api.h"
#include "napi/native_node_api.h"
#include "utils/log.h"

extern const char _binary_scope_js_js_start[];
extern const char _binary_scope_js_js_end[];

static napi_value ScopeInit(napi_env env, napi_value exports)
{
    const char* ClassName = "scope";
    napi_value scopeClass = nullptr;
    NAPI_CALL(env, napi_define_class(env, ClassName, strlen(ClassName), nullptr,
    nullptr, 0, nullptr,
    &scopeClass));
    static napi_property_descriptor desc[] = {
        DECLARE_NAPI_PROPERTY("scope", scopeClass)
    };
    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
    return exports;
}

// Scope module define
static napi_module scopeModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = ScopeInit,
    .nm_modname = "scope",
    .nm_priv = ((void*)0),
    .reserved = {0},
};

// Scope module register
extern "C"
__attribute__((constructor)) void RegisterModule()
{
    napi_module_register(&scopeModule);
}

// Scope JS register
extern "C"
__attribute__((visibility("default"))) void NAPI_scope_GetJSCode(const char** buf, int* buflen)
{
    if (buf != nullptr) {
        *buf = _binary_scope_js_js_start;
    }
    if (buflen != nullptr) {
        *buflen = _binary_scope_js_js_end - _binary_scope_js_js_start;
    }
}