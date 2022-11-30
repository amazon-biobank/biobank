#include <node.h>
#include "LyraHash.h"

#define HASH_SIZE 64
#define SALT_SIZE 16

using namespace v8;

void getSalt(const FunctionCallbackInfo<Value>& args){
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();
    
    if (args.Length() != 1){
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong number of arguments")
                .ToLocalChecked()));
        return;
    }

    if (!args[0]->IsInt32()) {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
        return;
    }

    Local<Number> int1 = Local<Number>::Cast(args[0]);
    size_t saltLength = int1->Int32Value(context).FromJust();

    char *randomSalt = (char*) malloc (sizeof(char) * saltLength);
    generateSalt(randomSalt, saltLength);

    Local<ArrayBuffer> js_salt = ArrayBuffer::New(
        isolate, randomSalt, saltLength);

    args.GetReturnValue().Set(js_salt);
}

void getHash(const FunctionCallbackInfo<Value>& args){
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();
    
    if (args.Length() != 3){
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong number of arguments")
                .ToLocalChecked()));
        return;
    }

    if (!args[0]->IsString() || !args[1]->IsString() || !args[2]->IsUint32()) {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
        return;
    }

    String::Utf8Value str1(isolate, args[0]);
    String::Utf8Value str2(isolate, args[1]);
    Local<Number> uint1 = Local<Number>::Cast(args[2]);
    std::string input(*str1);
    std::string salt(*str2);
    unsigned int saltLength = uint1->Uint32Value(context).FromJust();

    unsigned char *hashOutput = (unsigned char*) malloc (HASH_SIZE * sizeof(unsigned char));
    char *input_c = const_cast<char*>(input.c_str());
    char *salt_c = const_cast<char*>(salt.c_str());

    if (LyraHash(hashOutput, input_c, salt_c, saltLength)){
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Couldn't hash the string")
                .ToLocalChecked()));
        return;
    }

    Local<ArrayBuffer> js_hash = ArrayBuffer::New(
        isolate,
        (void *) hashOutput,
        HASH_SIZE,
        ArrayBufferCreationMode::kInternalized
    );

    args.GetReturnValue().Set(js_hash);
}

void initialize(Local<Object> exports){
    NODE_SET_METHOD(exports, "getSalt", getSalt);
    NODE_SET_METHOD(exports, "getHash", getHash);
}

NODE_MODULE(lyra2, initialize);
