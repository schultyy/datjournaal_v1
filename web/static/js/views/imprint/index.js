import React from 'react';

export default class ImprintView extends React.Component {
  static aboutText() {
    return(
      <div>
        <h4>The name</h4>
        <p>
          The name 'dat Journaal' is Plattdeutsch (low German) and translates to "Die Zeitung"/"the newspaper".
        </p>
        <h4>About this project</h4>
        <p>
          In mid 2016 Instagram decided to change the timeline behavior from showing posts in a chronological order to a custom per-user order.
          An algorithm now decides which posts appear on top, which posts the user most likely wants to see first. For me, this new behavior makes it less usable and confusing.
          At that point I decided that it's time to take alternatives for sharing photos into account. After a few weeks I came to the point where I decided to do this on my own: running my own service
          to post my photos.
          To evaluate if this actually makes sense and if the technologies are suitable for that job I built a few prototypes. In the end it took my around one to two months
          to get the software running (including a working deployment on a production server). This project is a first for me because it's the first time I did everything on my own
          from the first commit to setting up production machines and deploy the software on it.
          <br />
          Since I started working on it it was both exciting but also sometimes frustrating. Frustrating because it takes effort to build a solid foundation (and that's still not done), but
          it is exciting for a couple of reasons:
        </p>
        <ul>
          <li>I own the data I produce</li>
          <li>I can decide on the features I want</li>
          <li>There's no algorithm involved trying to make the user experience "better" for me</li>
          <li>
            Most important: I don't have to fear that the service will shut down at some point because it gets sold to some other company and they decide it's not worth it anymore
          </li>
        </ul>
        <h4>Tools / Stack</h4>
        <p>
          These tools are used:
        </p>
        <ul>
          <li>Elixir</li>
          <li>Phoenix</li>
          <li>React</li>
          <li>Redux</li>
          <li>Chef Solo</li>
          <li>Terraform</li>
        </ul>
      </div>
    );
  }
  render() {
    return (
      <div className="imprint">
        {ImprintView.aboutText()}
        <h4>This is a project by:</h4>
        <p className="contact">
          Jan Schulte<br />
          Twitter: <a href="https://twitter.com/ganzefolge" target="_blank">@ganzefolge</a>
          <br />
          Contact: hello at unexpected-co dot de
        </p>
      </div>
    );
  }
}
