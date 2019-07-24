/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package kr.ahsol.myinterview_uiwang;

import android.app.NotificationChannel;
import android.app.NotificationManager;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.google.firebase.messaging.FirebaseMessaging;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebViewEngine;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FirebaseMessaging.getInstance().subscribeToTopic("news");
        FirebaseInstanceId.getInstance().getToken();
        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }


        //font-size
        super.init();
        SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();

        WebView webView = (WebView) systemWebViewEngine.getView();
        WebSettings webSettings = webView.getSettings();
        webSettings.setTextSize(WebSettings.TextSize.NORMAL);
        //font-size

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);

        //로딩 이미지 goonglee =====================================
        final ImageView iv = new ImageView(this);
        iv.setBackgroundResource(R.drawable.screen); // screen.png

        this.addContentView(iv, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                iv.setVisibility(View.GONE);
            }
        }, 1500);
        //로딩 이미지 goonglee =====================================

        //숏컨 생성 goonglee =====================================
        getPreferences();
        //숏컨 생성 goonglee =====================================


        //FB 노티파이 goonglee =====================================
        if (Build.VERSION.SDK_INT >= 26) {
            // Create channel to show notifications.
            String channelId = getString(R.string.gcm_defaultSenderId);
            String channelName = getString(R.string.gcm_defaultSenderId);
            NotificationManager notificationManager =
                    getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(new NotificationChannel(channelId,
                    channelName, NotificationManager.IMPORTANCE_HIGH));
        }

        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                Object value = getIntent().getExtras().get(key);
                Log.d(TAG, "Key: " + key + " Value: " + value);
                //Toast.makeText(MainActivity.this, "Key: " + key + " Value: " + value, Toast.LENGTH_SHORT).show();
            }
        }

        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        getDeviceToken();
                    }
                }, 3000);

        //FB 노티파이 goonglee =====================================



    }


    //FB 노티파이 goonglee =====================================
    private void getDeviceToken(){
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String token = task.getResult().getToken();

                        // Log and toast
                        //String msg = getString(R.string.msg_token_fmt, token);
                        //Log.d(TAG, msg);
                        //Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();

                        String script = "";
                        script = "javascript:GetDeviceToken(\"" + token + "\");";
                        loadUrl(script);

                    }
                });
    }
    //FB 노티파이 goonglee =====================================


    //숏컨 생성 goonglee =====================================
    public SharedPreferences shortcutSharedPref;
    public boolean isInstalled;

    private void getPreferences(){
        shortcutSharedPref = getSharedPreferences("what", MODE_PRIVATE);
        isInstalled = shortcutSharedPref.getBoolean("isInstalled", false);

        if (!isInstalled) {
            addShortcut(this);
        }
    }

    private void addShortcut(Context context) {
        Intent shortcutIntent = new Intent(Intent.ACTION_MAIN);
        shortcutIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        shortcutIntent.setClassName(context, getClass().getName());
        shortcutIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);

        Intent intent = new Intent();
        intent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        intent.putExtra(Intent.EXTRA_SHORTCUT_NAME,
                getResources().getString(R.string.app_name));
        intent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE,
                Intent.ShortcutIconResource.fromContext(context,
                        R.mipmap.icon));
        intent.putExtra("duplicate", false);
        intent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");

        sendBroadcast(intent);

        SharedPreferences.Editor editor = shortcutSharedPref.edit();
        editor.putBoolean("isInstalled", true);
        editor.commit();
    }

}
