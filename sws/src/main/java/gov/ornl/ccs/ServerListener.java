package gov.ornl.ccs;

import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;

public class ServerListener implements ServletContextListener
{

@Override
public void contextDestroyed(ServletContextEvent sce)
{
    System.out.println("SWS stopping");

    TitanAPI api = TitanAPI.getInstance();
    api.shutdown();
}

@Override
public void contextInitialized(ServletContextEvent sce)
{
    System.out.println("SWS starting");
}

}
