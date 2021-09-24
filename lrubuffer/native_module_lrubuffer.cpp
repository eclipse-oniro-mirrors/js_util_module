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
#include <cstring>

#include "napi/native_api.h"
#include "napi/native_node_api.h"

static napi_value LruBufferInit(napi_env env, napi_value exports)
{
    const char *lruBufferClassName = "lrubuffer";
    napi_value lruBufferClass = nullptr;
    NAPI_CALL(env, napi_define_class(env, lruBufferClassName, strlen(lruBufferClassName), nullptr,
                                     nullptr, 0, nullptr, &lruBufferClass));
    static napi_property_descriptor desc[] = {
        DECLARE_NAPI_PROPERTY("lrubuffer", lruBufferClass),
    };
    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
    return exports;
}

// lrubuffer module define
static napi_module lrubufferModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = LruBufferInit,
    .nm_modname = "lrubuffer",
    .nm_priv = ((void*)0),
    .reserved = { 0 },
};

extern "C" __attribute__ ((constructor)) void RegisterModule()
{
    napi_module_register(&lrubufferModule);
}

// lrubuffer JS register
extern "C"
__attribute__((visibility("default"))) void NAPI_lrubuffer_GetJSCode(const char **buf, int *buflen)
{
    extern const char _binary_js_lrubuffer_js_start[];
    extern const char _binary_js_lrubuffer_js_end[];
    if (buf != nullptr) {
        *buf = _binary_js_lrubuffer_js_start;
    }
    if (buflen != nullptr) {
        *buflen = _binary_js_lrubuffer_js_end - _binary_js_lrubuffer_js_start;
    }
}