#include <napi.h>
#include <iostream>
#include <wchar.h> 
#include <vector>
#ifdef WIN32
  #include <Windows.h>
#else
  #include <dirent.h>
  #include <sys/stat.h>
#endif

namespace Win_Explorer
{

class my_File{
  public:
    std::wstring name;
    std::wstring ex;
    bool isDir;
    bool isHidden;
    unsigned long size1;
};

bool checkFilter(std::vector<std::string> list, wchar_t *ex);

Napi::Array ListFiles(const Napi::CallbackInfo &info);

Napi::Array ListDrivesInfo(const Napi::CallbackInfo &info);

Napi::Object Init(Napi::Env env, Napi::Object exports);
} // namespace Unrar_Mod