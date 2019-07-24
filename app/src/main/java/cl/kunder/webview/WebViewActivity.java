package cl.kunder.webview;

import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaWebView;
//import org.apache.cordova.PluginEntry;//goonglee

import java.util.Locale;

import kr.ahsol.myinterview_uiwang.R;

public class WebViewActivity extends CordovaActivity {
  static Dialog dialogPlugin;
  static Activity activityPlugin;
  protected CordovaWebView appViewPlugin;
  private boolean hasPausedEver;


  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    //Aqui debo crear el loading

    //goonglee
    overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    //goonglee

    activityPlugin = this;
    WebViewPlugin.webViewActivity = this;
    Bundle b = getIntent().getExtras();
    String url = b.getString("url");
    Boolean shouldShowLoading = false;
    try {
      shouldShowLoading = b.getBoolean("shouldShowLoading");
    }
    catch(Exception e) {

    }
    if(shouldShowLoading){
      showLoading();
    }
    loadUrl((url.matches("^(.*://|javascript:)[\\s\\S]*$")?"":"file:///android_asset/www/")+url);


    //goonglee
    final ImageView iv = new ImageView(this);
    iv.setBackgroundResource(R.drawable.screen_second); // screen.png

    this.addContentView(iv, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        iv.animate().alpha(1.0f);
        iv.setVisibility(View.GONE);
      }
    }, 1000);
    //goonglee



    appViewPlugin.getView().setOnTouchListener(new View.OnTouchListener() {
      Handler handler = new Handler();

      int numberOfTaps = 0;
      long lastTapTimeMs = 0;
      long touchDownMs = 0;

      @Override
      public boolean onTouch(View v, MotionEvent event) {
        switch (event.getAction()) {
          case MotionEvent.ACTION_DOWN:
            touchDownMs = System.currentTimeMillis();
            break;
          case MotionEvent.ACTION_UP:
            handler.removeCallbacksAndMessages(null);

            if ((System.currentTimeMillis() - touchDownMs) > ViewConfiguration.getTapTimeout()) {
              //it was not a tap
              numberOfTaps = 0;
              lastTapTimeMs = 0;
              break;
            }

            if (numberOfTaps > 0
                    && (System.currentTimeMillis() - lastTapTimeMs) < ViewConfiguration.getDoubleTapTimeout()) {
              numberOfTaps += 1;
            } else {
              numberOfTaps = 1;
            }

            lastTapTimeMs = System.currentTimeMillis();

            if (numberOfTaps == 5) {
              WebViewPlugin.webViewPlugin.callDebugCallback();
            }
        }
        return false;
      }
    });
  }

  @Override
  protected void init() {
    /* goonglee
    super.init();

    if (WebViewPlugin.webViewPlugin == null) {
      return;
    }
    appViewPlugin.getPluginManager().addService(new PluginEntry("WebViewPlugin", WebViewPlugin.webViewPlugin));
    goonglee */
    super.init();
    appViewPlugin = makeWebView();
    createViews();
    if (!appViewPlugin.isInitialized()) {
      appViewPlugin.init(cordovaInterface, pluginEntries, preferences);
    }
    cordovaInterface.onCordovaInit(appViewPlugin.getPluginManager());

    // Wire the hardware volume controls to control media if desired.
    String volumePref = preferences.getString("DefaultVolumeStream", "");
    if ("media".equals(volumePref.toLowerCase(Locale.ENGLISH))) {
      setVolumeControlStream(AudioManager.STREAM_MUSIC);
    }
  }

  public static boolean showLoading() {
    // Loading spinner
    activityPlugin.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        dialogPlugin = new Dialog(activityPlugin,android.R.style.Theme_Translucent_NoTitleBar);
        ProgressBar progressBar = new ProgressBar(activityPlugin,null,android.R.attr.progressBarStyle);

        LinearLayout linearLayout = new LinearLayout(activityPlugin);
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        RelativeLayout layoutPrincipal = new RelativeLayout(activityPlugin);
        layoutPrincipal.setBackgroundColor(Color.parseColor("#d9000000"));

        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.addRule(RelativeLayout.CENTER_IN_PARENT);

        linearLayout.addView(progressBar);

        linearLayout.setLayoutParams(params);

        layoutPrincipal.addView(linearLayout);

        dialogPlugin.setContentView(layoutPrincipal);
        dialogPlugin.setOnCancelListener(new DialogInterface.OnCancelListener() {
          @Override
          public void onCancel(DialogInterface dialogInterface) {

          }
        });
        dialogPlugin.setOnKeyListener(new DialogInterface.OnKeyListener() {
          @Override
          public boolean onKey(DialogInterface dialogInterface, int i, KeyEvent keyEvent) {
            if(keyEvent.getKeyCode() == KeyEvent.KEYCODE_BACK)
              return true;
            return false;
          }
        });

        dialogPlugin.show();
      }
    });

    return true;
  }

  public static boolean hideLoading() {
    // Loading spinner
    activityPlugin.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        dialogPlugin.hide();
      }
    });
    return true;
  }

  public String getUrl() {
    return appViewPlugin.getUrl();
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (hasPausedEver && WebViewPlugin.webViewPlugin != null) {
      WebViewPlugin.webViewPlugin.callResumeCallback(getUrl());
    }
  }

  @Override
  protected void onPause() {
    super.onPause();
    hasPausedEver = true;
    WebViewPlugin.webViewPlugin.callPauseCallback(getUrl());
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    WebViewPlugin.webViewPlugin.callExitCallback();
  }
}
