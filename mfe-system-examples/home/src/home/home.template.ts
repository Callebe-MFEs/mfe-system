import { html } from "lit-html";

export const template = () => {
  return html`
    <div class="mws-home">
      <h1>Welcome to Micro-Frontend Solution Examples Home App</h1>
      <p>
        This is a Prof of Concept application to demonstrate the Micro-Frontend
        solution.
      </p>
      <p>
        The application is composed by smaller applications that we call
        Micro-Frontends (MFE).
      </p>

      <h2>Host Application</h2>
      <p>
        Right now, you are seeing the Host Applicatin, the Shell component, and
        the Home Application. If this is your first access to the system in this
        session, then they are the only applications loaded so far.
      </p>
      <p>
        The host application is the entry point, and it's responsible for
        orchestrating the applications. The Shell component is responsible for
        providing the layout of the page, In this case, the Shell component
        provides the Header and the Footer of the page, that is shared with all
        the other MFEs.
      </p>
      <p>
        The section that contains this text is where the main content is
        rendered, and is where each MFE will render their content. You are
        seeing the Home Application.
      </p>

      <h2>Micro-Frontends (MFEs)</h2>
      <p>There are other MFEs in this application</p>

      <h3>Home MFE</h3>
      <p>
        The Home MFE is the main content of the Home Application, and it is
        responsible for rendering this text.
      </p>
      <p>
        It is implemented using
        <a href="https://lit.dev/" target="_blank">lit</a> library to create Web
        Components.
      </p>
      <p>
        The home mfe can be accessed as a stand-alone application by the URL
        <a href="/apps/home/" target="_blank">/apps/homes/</a>
      </p>

      <h3>Messages</h3>
      <p>
        The Messages MFE simulates a chat application, where the user can see
        their contancts, select one and start chatting with them.
      </p>
      <p>
        It is implemented using
        <a href="https://react.dev/" target="_blank">React</a> library to create
        dinamic and reactive web elements.
      </p>
      <p>
        The messages mfe can be accessed as a stand-alone application by the URL
        <a href="/apps/messages/" target="_blank">/apps/messages/</a>
      </p>

      <h3>Tasks</h3>
      <p>
        The Tasks MFE implements a small task list where you can Read, Add, Edit
        and Delete tasks.
      </p>
      <p>
        It is implemented using
        <a href="https://lit.dev/" target="_blank">lit</a> library to create Web
        Components.
      </p>
      <p>
        The tasks mfe can be accessed as a stand-alone application by the URL
        <a href="/apps/tasks/" target="_blank">/apps/tasks/</a>
      </p>

      <h3>Applications</h3>
      <p>
        The Applications MFE manages the list of Micro-Frontend applications
        that are available in the system. We can configure their mounting route,
        where their assets are located, and the name of the application.
      </p>
      <p>
        It is implemented using
        <a href="https://angular.dev/">Angular</a> framework to create powerfull
        and dinamic Single Page Applications
      </p>
      <p>
        The Applications mfe can be accessed as a stand-alone application by the
        URL
        <a href="/apps/applications/" target="_blank">/apps/applications/</a>
      </p>

      <!-- <h3>Tasks MFE</h3>
      <p>
        The Tasks MFE implements a small task list where you can Read, Add, Edit
        and Delete tasks.
      </p>
      <p>
        It is implemented using
        <a href="https://lit.dev/" target="_blank">lit</a> library to create Web
        Components.
      </p>

      <h3>Messages</h3>
      <p>
        The Messages MFE simulates a chat application, where the user can see
        their contancts, select one and start chatting with them.
      </p>
      <p>
        It is implemented using
        <a href="https://react.dev/" target="_blank">React</a> library to create
        dinamic and reactive web elements.
      </p>

      <h3>User Profile</h3>
      <p>
        The User Profile MFE simulates the area where the user can update their
        information and set their preferences
      </p>
      <p>
        It is implemented using
        <a href="https://angular.dev/">Angular</a> framework to create powerfull
        and dinamic Single Page Applications
      </p> -->
    </div>
  `;
};
