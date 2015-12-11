; *************************************************************************
;   This is the NSIS (http://nsis.sf.net) installer of UsbPicProg         *
;   Copyright (C) 2008-2010 by Frans Schreuder, Francesco Montorsi        *
;   usbpicprog.sourceforge.net                                            *
;                                                                         *
;   This program is free software; you can redistribute it and/or modify  *
;   it under the terms of the GNU General Public License as published by  *
;   the Free Software Foundation; either version 2 of the License, or     *
;   (at your option) any later version.                                   *
;                                                                         *
;   This program is distributed in the hope that it will be useful,       *
;   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
;   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
;   GNU General Public License for more details.                          *
;                                                                         *
;   You should have received a copy of the GNU General Public License     *
;   along with this program; if not, write to the                         *
;   Free Software Foundation, Inc.,                                       *
;   59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.             *
; *************************************************************************

; -------------------------------------------------------------------------------------------------
; Include Modern UI

;  !include "MUI.nsh"
  !include "MUI2.nsh"
  !include "WinVer.nsh"
  
  
; -------------------------------------------------------------------------------------------------
; This Macro will create a Internet Shorcut (*.url).
; http://nsis.sourceforge.net/Create_Internet_Shorcuts_during_installation
; Well, you might created first then compile it.
; But, let's create a few during installation. :)
; This example put the Internet Shortcut in the $EXEDIR
; with a shortcut in the $DESKTOP.
; Modify the macro according to your needs.
; Created by Joel
; Notes:
; URLFile = The name of our .url file.
; URLSite = The url to the site.
; URLDesc = The description of our shortcut, when mouse hoover it.

!Macro "CreateURL" "URLFile" "URLSite" "URLDesc"
  WriteINIStr "$INSTDIR\${URLFile}.url" "InternetShortcut" "URL" "${URLSite}"
  SetShellVarContext "all"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\${URLFile}.lnk" "$INSTDIR\${URLFile}.url" "" \
                 "$INSTDIR\${URLFile}.url" 0 "SW_SHOWNORMAL" "" "${URLDesc}"
!macroend

!macro "CreateURLShortCut" "URLFile" "URLSite" "URLDesc"
  WriteINIStr "$INSTDIR\${URLFile}.url" "InternetShortcut" "URL" "${URLSite}"
!macroend

; -------------------------------------------------------------------------------------------------
; General

  ; Overwrite the default ICON in the installer
  !define MUI_ICON "..\xboxbigbutton.ico"

  ; NOTE: the version should be the same as the one in xboxbigbuttonwinusbdriver.inf
  !define OUTPUT_DIR		      "..\binaries\"
  !define PRODUCT_NAME            "Xbox 360 Big Button IR Controller for Windows"
  !define PRODUCT_VERSION         "1.0.0"
  !define PRODUCT_PUBLISHER       "Sverrir Sigmundarson"
  !define PRODUCT_WEBSITE		  "http://sverrirs.github.io/XboxBigButton"
  !define PRODUCT_WEBSITE_TITLE	  "XboxBigButton.NET Website"
  !define PRODUCT_WEBSITE_DESC	  "Visit the XboxBigButton.NET Website for more information and examples"

  ; are we packaging the 32bit or the 64bit version of the usbpicprog?
  ; allowed values: "x86" or "amd64"
  !ifndef ARCH                     ; see build_installers.bat
    !define ARCH                  "amd64"
  !else
    !if "${ARCH}" != "amd64" 
      !if "${ARCH}" != "x86"
        !error "Invalid value for the ARCH define"
      !endif
    !endif
  !endif

  ; Name and file
  Name "${PRODUCT_NAME} ${PRODUCT_VERSION} ${ARCH} Installer"
  OutFile "${OUTPUT_DIR}${PRODUCT_NAME}-${ARCH}-${PRODUCT_VERSION}.exe" 
  Icon "${MUI_ICON}"

  ; Default installation folder
  !if "${ARCH}" == "amd64"
    InstallDir "$PROGRAMFILES64\${PRODUCT_NAME}"
  !else
    InstallDir "$PROGRAMFILES\${PRODUCT_NAME}"
  !endif
  
  LicenseData "..\..\LICENSE"
  SetCompressor /SOLID lzma    ; this was found to be the best compressor

  
  ; see http://nsis.sourceforge.net/Shortcuts_removal_fails_on_Windows_Vista for more info:
  RequestExecutionLevel admin

; -------------------------------------------------------------------------------------------------
; Pages

  !insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  
; -------------------------------------------------------------------------------------------------
; Interface Settings

  !define MUI_ABORTWARNING
  
; -------------------------------------------------------------------------------------------------
; Languages
 
  !insertmacro MUI_LANGUAGE "English"
  
; -------------------------------------------------------------------------------------------------
; Additional info (will appear in the "details" tab of the properties window for the installer)

  VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName"      "${PRODUCT_NAME}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "Comments"         ""
  VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName"      "${PRODUCT_NAME} Team"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalTrademarks"  "Application released under the MIT license"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright"   "� ${PRODUCT_NAME} Team"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription"  "Sverrir Sigmundarson"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion"      "${PRODUCT_VERSION}"
  VIProductVersion                                         "${PRODUCT_VERSION}.0" 

; -------------------------------------------------------------------------------------------------
; Installer Sections

Section "" ; No components page, name is not important

  ; check if the architecture of the currently-running system is OK
  
  GetVersion::WindowsPlatformArchitecture
  Pop $R0
  DetailPrint "Detected a $R0 bit Windows architecture"
  !if "${ARCH}" == "amd64"
    StrCmp "$R0" "64" proceed
    MessageBox MB_OK|MB_ICONEXCLAMATION "This installer is for 64bit Windows versions but has detected a 32bit operating system! Please download the X86 version of this installer."
    Quit
  !else
    StrCmp "$R0" "32" proceed
    MessageBox MB_OK|MB_ICONEXCLAMATION "This installer is for 32bit Windows versions but has detected a 64bit operating system! Please download the AMD64 version of this installer."
    Quit
  !endif
  
proceed:

  ; Set files to be extracted in the user-chosen installation path:

  SetOutPath "$INSTDIR"
  File "${PRODUCT_WEBSITE_TITLE}.url"
  File ..\..\LICENSE
  File ${MUI_ICON}    ; used by the DPINST utility

  SetOutPath "$INSTDIR\driver"
  File ..\driver\*.inf
  File ..\driver\${ARCH}\dpinst.exe
  File ..\driver\dpinst.xml

  SetOutPath "$INSTDIR\driver\${ARCH}"
  File ..\driver\${ARCH}\*.dll
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Select correct registry view before using WriteRegStr
  !if "${ARCH}" == "amd64"
    SetRegView 64
  !else
    SetRegView 32
  !endif
  
  ; Add the uninstaller to the list of programs accessible from "Control Panel -> Programs and Features"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "DisplayIcon" "$\"$INSTDIR\xboxbigbutton.ico$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "URLInfoAbout" "${PRODUCT_WEBSITE}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                   "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" \
                     "EstimatedSize" 400
                     ; the estimated must be expressed in Kb; for us it's about 400 Kb!

  ; Create shortcuts
  SetShellVarContext all        ; see http://nsis.sourceforge.net/Shortcuts_removal_fails_on_Windows_Vista
  SetOutPath "$INSTDIR"         ; this will be the working directory for the shortcuts created below
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  !insertmacro "CreateURL" "${PRODUCT_WEBSITE_TITLE}" "${PRODUCT_WEBSITE}" "${PRODUCT_WEBSITE_DESC}"
  CreateShortCut "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  
  ;${If} ${AtMostWin7}
    ;DetailPrint "Windows version is lower than 7, installing driver"
    ; Last, run the Microsoft driver installer redistributable
    DetailPrint "Running the dpinst utility to install XboxBigButton's drivers"
    ExecWait '"$INSTDIR\driver\dpinst.exe"' $0
    IntFmt $2 "0x%08X" $0
    DetailPrint "Return code was $2"
    ; check the higher byte of the return value of DPINST; it can assume the values:
    ; 0x80 if a driver package could NOT be installed
    ; 0x40 if a computer restart is necessary
    ; 0x00 if everything was ok
    ; or a combination of them (the only possible one in this case is 0xC0)
    ; see http://msdn.microsoft.com/en-us/library/ms791066.aspx for more info
    IntOp $1 $0 / 0x1000000                  ; fast way to keep only the higher byte
    IntFmt $2 "0x%X" $1
    DetailPrint "The higher byte of the return code was $2"
    IntCmp $1 0x00 installed_ok
    IntCmp $1 0x40 installed_ok_need_reboot
    IntCmp $1 0x80 install_failed
    IntCmp $1 0xC0 install_failed
  
    ; unhandled return code ?!?
    DetailPrint "Unknown return value of the DPINST utility! Check %SYSTEMROOT%\DPINST.LOG for more info."
    MessageBox MB_OK|MB_ICONEXCLAMATION "Unknown return value of the DPINST utility! Check %SYSTEMROOT%\DPINST.LOG for more info."
    Abort "Couldn't install drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
	installed_ok_need_reboot:
	  DetailPrint "Drivers were installed successfully but require a reboot"
	  MessageBox MB_YESNO|MB_ICONQUESTION "The driver installation finished but requires a system reboot. Do you wish to reboot now?" IDNO +2
	  Reboot
	  Goto installed_ok
	install_failed:
	  DetailPrint "Drivers could not be installed! Check %SYSTEMROOT%\DPINST.LOG for more info."
	  MessageBox MB_OK|MB_ICONEXCLAMATION "Couldn't install drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
	  Abort "Couldn't install drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
	installed_ok:
	  ; do nothing
	  DetailPrint "Drivers were installed successfully."	
    
  ;${Else}
  ;  DetailPrint "Windows 8 or later detected, use Zadig to install the driver."
  ;  MessageBox MB_OK "Windows 8 or later needs a signed driver.$\r$\nPlease follow the instructions to install the driver$\r$\nA browswer will be opened."
  ;  Exec "rundll32 url.dll,FileProtocolHandler ${PRODUCT_WEBSITE}"
  ;${EndIf} 
  
SectionEnd

; -------------------------------------------------------------------------------------------------
; Uninstaller Section

Section "Uninstall"

  ; note that uninstalling the drivers installed by dpinst.exe is not easy 
  ; and currently it seems to be supported only through the "Add Programs and Features"
  ; panel of Control panel (see http://msdn.microsoft.com/en-us/library/ms791069.aspx),
  ; which we disable in dpinst.xml!
  
  ; Select correct registry view before using DeleteRegKey
  !if "${ARCH}" == "amd64"
    SetRegView 64
  !else
    SetRegView 32
  !endif
  
  DetailPrint "Running the dpinst utility to uninstall XboxBigButton's drivers"
  ExecWait '"$INSTDIR\driver\dpinst.exe /u"' $0
  IntFmt $2 "0x%08X" $0
  DetailPrint "Return code was $2"
  ; check the higher byte of the return value of DPINST; it can assume the values:
  ; 0x80 if a driver package could NOT be uninstalled
  ; 0x40 if a computer restart is necessary
  ; 0x00 if everything was ok
  ; or a combination of them (the only possible one in this case is 0xC0)
  ; see http://msdn.microsoft.com/en-us/library/ms791066.aspx for more info
  IntOp $1 $0 / 0x1000000                  ; fast way to keep only the higher byte
  IntFmt $2 "0x%X" $1
  DetailPrint "The higher byte of the return code was $2"
  IntCmp $1 0x00 uninstalled_ok
  IntCmp $1 0x40 uninstalled_ok_need_reboot
  IntCmp $1 0x80 uninstall_failed
  IntCmp $1 0xC0 uninstall_failed
  
  ; unhandled return code ?!?
  DetailPrint "Unknown return value of the DPINST utility! Check %SYSTEMROOT%\DPINST.LOG for more info."
  MessageBox MB_OK|MB_ICONEXCLAMATION "Unknown return value of the DPINST utility! Check %SYSTEMROOT%\DPINST.LOG for more info."
  Abort "Couldn't uninstall drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
  uninstalled_ok_need_reboot:
    DetailPrint "Drivers were uninstalled successfully but require a reboot"
    MessageBox MB_YESNO|MB_ICONQUESTION "The driver uninstallation finished but requires a system reboot. Do you wish to reboot now?" IDNO +2
    Reboot
    Goto uninstalled_ok
  uninstall_failed:
    DetailPrint "Drivers could not be unnstalled! Check %SYSTEMROOT%\DPINST.LOG for more info."
    MessageBox MB_OK|MB_ICONEXCLAMATION "Couldn't uninstall drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
    Abort "Couldn't uninstall drivers! Check %SYSTEMROOT%\DPINST.LOG for more info."
  uninstalled_ok:
    ; do nothing
    DetailPrint "Drivers were uninstalled successfully."	
  
  ; clean the list accessible from "Control Panel -> Programs and Features"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"

  ; clean start menu
  SetShellVarContext all
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\Uninstall.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_WEBSITE_TITLE}.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"

  ; clean installation folder
  Delete "$INSTDIR\uninstall.exe"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\${PRODUCT_WEBSITE_TITLE}.url"
  Delete "$INSTDIR\xboxbigbutton.ico"
  Delete "$INSTDIR\driver\*.inf"
  Delete "$INSTDIR\driver\dpinst.exe"
  Delete "$INSTDIR\driver\dpinst.xml"
  Delete "$INSTDIR\driver\${ARCH}\*.dll"
  RMDir "$INSTDIR\driver\${ARCH}"
  RMDir "$INSTDIR\driver"
  RMDir "$INSTDIR"

SectionEnd

