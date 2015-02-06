from django.conf.urls import patterns, url
from constellationfe import views

urlpatterns = patterns('',
    url(r'^$',views.index,name='index'),
    
    
    url(r'^workspace/(?P<user_id>\w+)/$',views.workspace,name='workspace'),
    
    url(r'^doi/(?P<user_id>\w+)/$',views.doi,name='doi'),
    
    #collaborators API
    url(r'^groupinfo/(?P<user_id>\w+)/$',views.groupinfo,name='groupinfo'),
    url(r'^groups/(?P<group_id>\w+)/$',views.groups,name='groups'),
    
    #jobs API
    url(r'^jobsproxy/(?P<user_id>\w+)/$',views.jobsproxy,name='jobsproxy'),
    url(r'^appsproxy/$',views.appsproxy,name='appsproxy'),
    
    
    url(r'^files/(?P<user_id>\w+)/$',views.files,name='files'),
    
    url(r'^filesOID/(?P<user_id>\w+)/$',views.filesOID,name='filesOID'),
    
    url(r'^dois/(?P<user_id>\w+)/$',views.dois,name='dois'),
    
    url(r'^doiPut/(?P<user_id>\w+)/$',views.doiPut,name='doiPut'),
    
    url(r'^tags/links/(?P<tag_id>\w+)/$',views.taglinks,name='taglinks'),
    
    url(r'^tags/$',views.tags,name='tags'),
    
    
    url(r'^tagproxy/(?P<user_id>\w+)/$',views.tagproxy,name='tagproxy'),
    
    url(r'^associationproxy/(?P<user_id>\w+)/$',views.associationproxy,name='associationproxy'),
      
      
      
    url(r'^celeryEx/$',views.celeryEx,name='celeryEx'),      
    url(r'^groupEx/$',views.groupEx,name='groupEx'),        
    url(r'^jobEx/$',views.groupEx,name='jobEx'), 
    
    url(r'^testWrapper/$',views.testWrapper,name='testWrapper'),
         
)