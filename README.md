# 소스코드 압축 및 패지키 네이밍 생성을 위한 Github action 
## 주요 기능
* 소스코드 내에 version.json 파일을 읽어 버전 정보를 획득
* 파라메터로 현재 빌드되는 소스코드의 Git Hash를 획득
* 파라메터로 파일명의 Prefix 값을 획득
* {Prefix}\_{Version}\_{GitHash}\_{yyyymmdd}.zip 형태로 패키지명 생성
* 소스코드 내에 .archiveignore 파일을 읽어 압축 시 제외할 파일 목록을 획득
* .archiveignore 파일의 파일 목록을 제외하고 소스코드 압축



## Action 사용 방법
* Github action workflows yml 파일에 아래와 같이 사용
* Pramaters 
  - fileName : 패지키명의 Prefix 문자열
  - gitSha : 현재 빌드의 GitHash 값을 가져오는 환경 변수 설정

사용 예)
~~~yml
    - name : Archive relase source
      uses: royjsong/action-release-package-generator@master
      id: archive-release
      with:
        fileName: "ccnc_virtualkeyboard"
        gitSha: ${{ github.sha }}
~~~
* output
  - packageName : Prefix}\_{Version}\_{GitHash}\_{yyyymmdd} 의 문자열

사용 예)
~~~yml
    - name: Upload full artifact
          uses: actions/upload-artifact@v2
          with:
            name: ccnv-virtaulkeyboard-full
            path: |
              ./${{steps.archive-release.outputs.packageName}}-full.zip       
~~~

