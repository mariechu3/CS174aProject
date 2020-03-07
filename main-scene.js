window.Mirror_Scene = window.classes.Mirror_Scene = class Mirror_Scene extends Scene_Component {
  constructor(context, control_box) {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box);
    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(
          new Movement_Controls(context, control_box.parentElement.insertCell())
      );

    context.globals.graphics_state.camera_transform = Mat4.look_at(
        Vec.of(0, 5, 25),
        Vec.of(0, 0, 0),
        Vec.of(0, 1, 0)
    );
    this.initial_camera_location = Mat4.inverse(
        context.globals.graphics_state.camera_transform
    );

    this.initial_avatar_location = Mat4.identity().times(
        Mat4.translation([0, 0, 5])
    );
    this.avatar_pos = this.initial_avatar_location;

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        r,
        0.1,
        1000
    );

    const shapes = {
      // TODO:  Added in as many shapes as we need for this project
      torus: new Torus(15, 15),
      torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),
      sphere: new Subdivision_Sphere(4),
      box_3: new Cube_2(),
      box_4: new Cube(),
      box: new Cube(),
      box_1: new Cube(),
      box_2: new Cube(),
      mirror: new Mirror(50, 50),
      //frame: new Frame(50, 50),
      spike: new SpikeBall(15, 15, [2, 2]),
      square: new Square(),
      frame: new Cube_Outline(),
      avatar: new Shape_From_File("assets/cartoonboy.obj")
    };
    shapes.box_2.texture_coords = shapes.box_2.texture_coords.map(v => Vec.of(v[0] * 2, v[1] * 6));
    shapes.box_1.texture_coords = shapes.box_1.texture_coords.map(v => Vec.of(v[0] * 4, v[1] * 6))
    shapes.box_4.texture_coords = shapes.box_4.texture_coords.map(v => Vec.of(v[0] * 20, v[1] * 4));
    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials = {
      avatar: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 1, 1), { ambient: 0.1 }),
      wall: context
          .get_instance(Phong_Shader)
          .material(Color.of(0.8, 0.9, 1, 1), { ambient: 0.8}),
      funhouse_wall: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {
            ambient: 0.8,
            texture:context.get_instance("assets/funhouse.jpg",true)
          }),
      wall2: context
          .get_instance(Phong_Shader)
          .material(Color.of(0, 0, 0, 1), {//(Color.of(0.8, 0.9, 1, 1)
            ambient: .6,
            texture:context.get_instance("assets/wall.jpg",true)
          }),
      mirror: context
          .get_instance(Phong_Shader)
          .material(Color.of(0.95, 1, 0.95, 1), { ambient: 0.1, diffusivity: 0 }),
      frame: context.get_instance(Phong_Shader).material(Color.of(1,0,0,1)),
      //glass: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1), {ambient:1, texture:context.get_instance("assets/clear.png",true)}),
      floor: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
        ambient: 1,
        texture: context.get_instance("assets/ground.jpg", true)
      })
    };

    this.lights = [
      new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)
    ];

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }
  set_pos(dir) {
    if (dir === 1)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([-0.5, 0, 0]));
    else if (dir === 2)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0.5, 0]));
    else if (dir === 3) {
      if (this.avatar_pos[1][3] > -4.5)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, -0.5, 0]));
    } else if (dir === 4) {
      if (this.avatar_pos[2][3] > 1.0)
        this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, -0.5]));
    } else if (dir === 5)
      this.avatar_pos = this.avatar_pos.times(Mat4.translation([0, 0, 0.5]));
    else this.avatar_pos = this.avatar_pos.times(Mat4.translation([0.5, 0, 0]));

    this.move_l_pressed = this.move_r_pressed = this.move_u_pressed = this.move_d_pressed = this.move_f_pressed = this.move_b_pressed = false;
  }

  make_control_panel() {
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

    this.key_triggered_button("Left", ["a"], () => {
      this.move_l_pressed = true;
    },
    "#F60E26"
    );
    this.key_triggered_button("Right", ["d"], () => {
      this.move_r_pressed = true;
    },
    "#F2337B"
    );
   // this.new_line();
    this.key_triggered_button("Up", ["w"], () => {
      this.move_u_pressed = true;
    },
    "#F6D003"
    );
    this.key_triggered_button("Down", ["s"], () => {
      this.move_d_pressed = true;
    },
    "#077DDF"
    );
   // this.new_line();
    this.key_triggered_button("Forward", ["f"], () => {
      this.move_f_pressed = true;
    },
    "#173885"
    );
    this.key_triggered_button("Back", ["b"], () => {
      this.move_b_pressed = true;
    },
    "#872E8C"
    );
    this.new_line();
    this.new_line();
    this.new_line();
    this.key_triggered_button(
        "View whole",
        [" "],
        () => (this.attached = () => this.initial_camera_location),
        "#D72630"
    );
    //this.new_line();
    this.key_triggered_button(
        "mirror 1",
        ["z"],
        () => (this.attached = () => this.mirror_1),
        "#D7D52A"
    );
    this.key_triggered_button(
        "mirror 2",
        ["x"],
        () => (this.attached = () => this.mirror_2),
        "#F28A17"
    );
   // this.new_line();
    this.key_triggered_button(
        "mirror 3",
        ["c"],
        () => (this.attached = () => this.mirror_3),
        "#07A499"
    );
    this.key_triggered_button(
        "avatar",
        ["v"],
        () => (this.attached = () => this.avatar_pos),
        "#FF7EA0"
    );
   // this.new_line();
  }

  draw_middle_mirror_and_frame(graphics_state) {
    this.mirror_1 = Mat4.identity();
    const mirror_model = this.mirror_1.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
    /*this.shapes.mirror.draw(
        graphics_state,
        mirror_model,
        this.materials.mirror
    );*/
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    //this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  draw_left_mirror_and_frame(graphics_state) {
    //this.mirror_2 = Mat4.identity().times(Mat4.translation([-10, 0, 0]));
    this.mirror_2 = Mat4.identity().times(Mat4.translation([-12, 0, 0]));
    const mirror_model = this.mirror_2.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
    /*this.shapes.mirror.draw(
        graphics_state,
        mirror_model,
        this.materials.mirror
    );*/
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  draw_right_mirror_and_frame(graphics_state) {
    //this.mirror_3 = Mat4.identity().times(Mat4.translation([10, 0, 0]));
    this.mirror_3 = Mat4.identity().times(Mat4.translation([12, 0, 0]));
    const mirror_model = this.mirror_3.times(Mat4.scale([0.25, 0.5, 0.05]));
    const frame_model = mirror_model.times(Mat4.scale([1.5, 1.5, 1.5]));
   /* this.shapes.mirror.draw(
        graphics_state,
        mirror_model,
        this.materials.mirror
    );*/
    // TODO: [WALL_WITH_HOLES] needs to be fixed for collisions/actually have some way to just have a wall with holes in it
    this.shapes.frame.draw(graphics_state, frame_model, this.materials.wall);
  }

  setupScene(graphics_state) {
    let identity = Mat4.identity();
    this.draw_middle_mirror_and_frame(graphics_state);
    this.draw_left_mirror_and_frame(graphics_state);
    this.draw_right_mirror_and_frame(graphics_state);


    this.shapes.box_3.draw( //floor
        graphics_state,
        identity
            .times(Mat4.translation([0, -5, 0]))
            .times(Mat4.scale([30, 2.5, 30])),
        this.materials.floor
    );
    this.shapes.box_2.draw( //middle left
        graphics_state,
        identity
            .times(Mat4.translation([-6, 0, 0]))
            .times(Mat4.scale([2.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_2.draw( //middle right
        graphics_state,
        identity
            .times(Mat4.translation([6, 0, 0]))
            .times(Mat4.scale([2.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_1.draw( //left side
        graphics_state,
        identity
            .times(Mat4.translation([-22.5, 0, 0]))
            .times(Mat4.scale([7.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_1.draw( //right side
        graphics_state,
        identity
            .times(Mat4.translation([22.5, 0, 0]))
            .times(Mat4.scale([7.5, 10, .05])),
        this.materials.funhouse_wall
    );
    this.shapes.box_4.draw( //top
        graphics_state,
        identity
            .times(Mat4.translation([0, 20, 0]))
            .times(Mat4.scale([30, 10, .01])),
        this.materials.funhouse_wall
    );
    this.shapes.box_2.draw( //bottom
        graphics_state,
        identity
            .times(Mat4.translation([0,-2.5,0]))
            .times(Mat4.scale([30,.5,.01])),
        this.materials.funhouse_wall
    )
    this.shapes.box.draw( //outside boxwall
        graphics_state,
        identity
            .times(Mat4.translation([0,-5,0]))
            .times(Mat4.scale([30,30,30])),
        this.materials.wall2
    )
  }
  movement() {
    // movement of avatar
    if (this.move_r_pressed) this.set_pos(0);
    else if (this.move_l_pressed) this.set_pos(1);
    else if (this.move_u_pressed) this.set_pos(2);
    else if (this.move_d_pressed) this.set_pos(3);
    else if (this.move_f_pressed) this.set_pos(4);
    else if (this.move_b_pressed) this.set_pos(5);
  }
  mirror_eq(focus, obj_dist) {
    return (obj_dist * focus) / (obj_dist - focus);
  }

  display(graphics_state) {
    graphics_state.lights = this.lights; // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000,
        dt = graphics_state.animation_delta_time / 1000;
    let identity = Mat4.identity();
    this.setupScene(graphics_state);
    this.movement();

    //draw avatar
    if(this.avatar_pos[1][3]>0)
      this.avatar_pos[1][3] -= dt;
    console.log (this.avatar_pos)
    this.shapes.spike.draw(
        graphics_state,
        this.avatar_pos,
        this.materials.avatar
    );
    this.shapes.avatar.draw(graphics_state, Mat4.identity(),this.materials.avatar)

    //draw reflected cases
    //plane mirror
    let copy = this.avatar_pos;
    let scale = 1;
    let reflected_mat = [
      copy[0],
      copy[1],
      [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
      copy[3]
    ];
    if (this.avatar_pos[0][3] >= -4 && this.avatar_pos[0][3] <= 4)
      this.shapes.spike.draw(
          graphics_state,
          reflected_mat,
          this.materials.avatar
      );
    //convex case will always be upright
    else if (this.avatar_pos[0][3] < -4) {
      scale =
          (-1 * this.mirror_eq(-3, this.avatar_pos[2][3])) /
          this.avatar_pos[2][3];
      copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
      reflected_mat = [
        copy[0],
        copy[1],
        [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
        copy[3]
      ];
      this.shapes.spike.draw(
          graphics_state,
          reflected_mat,
          this.materials.avatar
      );
    }
    //concave cases
    else if (this.avatar_pos[0][3] > 4) {
      //if needs to be inverted
      if (this.mirror_eq(3, this.avatar_pos[2][3]) > 0) {
        scale =
            this.mirror_eq(2, this.avatar_pos[2][3]) / this.avatar_pos[2][3];
        console.log(scale);
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        copy = copy.times(Mat4.rotation(Math.PI/2,[0,0,1]))
        reflected_mat = [
          copy[0],
          [1 * copy[1][0], 1 * copy[1][1], 1 * copy[1][2], 1 * copy[1][3]],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
      } else {
        scale =
            (-1 * this.mirror_eq(3, this.avatar_pos[2][3])) /
            this.avatar_pos[2][3];
        copy = this.avatar_pos.times(Mat4.scale([scale, scale, scale]));
        reflected_mat = [
          copy[0],
          copy[1],
          [-1 * copy[2][0], -1 * copy[2][1], -1 * copy[2][2], -1 * copy[2][3]],
          copy[3]
        ];
      }
      this.shapes.spike.draw(
          graphics_state,
          reflected_mat,
          this.materials.avatar
      );
    }

    //camera coordinates
    let translate_back = Mat4.translation(Vec.of(0, 2, 8));
    if (typeof this.attached !== "undefined") {
      switch (this.attached()) {
        case this.initial_camera_location:
          graphics_state.camera_transform = Mat4.look_at(
              Vec.of(0, 5, 25),
              Vec.of(0, 0, 0),
              Vec.of(0, 1, 0)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.mirror_1:
        case this.mirror_2:
        case this.mirror_3:
          graphics_state.camera_transform = Mat4.inverse(
              this.attached().times(translate_back)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
        case this.avatar:
          graphics_state.camera_transform = Mat4.inverse(
              this.avatar_pos.times(translate_back)
          ).map((x, i) =>
              Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1)
          );
          break;
      }
    }
  }
};
window.Main_Scene = window.classes.Main_Scene = class Main_Scene extends Scene_Component {
  constructor(context, control_box) {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    super(context, control_box);
    // First, include a secondary Scene that provides movement controls:
    if (!context.globals.has_controls)
      context.register_scene_component(
          new Movement_Controls(context, control_box.parentElement.insertCell())
      );

    context.globals.graphics_state.camera_transform = Mat4.look_at(
        Vec.of(0, 5, 25),
        Vec.of(0, 0, 0),
        Vec.of(0, 1, 0)
    );
    this.initial_camera_location = Mat4.inverse(
        context.globals.graphics_state.camera_transform
    );

    const r = context.width / context.height;
    context.globals.graphics_state.projection_transform = Mat4.perspective(
        Math.PI / 4,
        r,
        0.1,
        1000
    );

    const shapes = {
      // TODO:  Added in as many shapes as we need for this project
      cone: new Closed_Cone(20,20,[1,2]),
      cylinder_mod: new Cylindrical_Tube_2(20,20,[1,1]),
      balloon: new Balloon(20,20,[1,1])
    };

    this.submit_shapes(context, shapes);

    // Make some Material objects available to you:
    this.materials = {
      tent: context.get_instance(Phong_Shader).material(Color.of(0,0,0,1),{ambient:1, texture: context.get_instance("assets/tent.jpg",true)}),
      balloon: context
          .get_instance(Phong_Shader)
          .material(Color.of(1, 1, 1, 1), {
            ambient: 0.8
          }),

    };

    this.lights = [
      new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(-20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(20, 10, 0, 1), Color.of(1, 1, 1, 1), 100000),
      new Light(Vec.of(0, 0, 20, 1), Color.of(1, 1, 1, 1), 1000),
      new Light(Vec.of(0, 0, -20, 1), Color.of(1, 1, 1, 1), 1000)
    ];


  }

  make_control_panel() {
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.


  }

  display(graphics_state) {
    graphics_state.lights = this.lights; // Use the lights stored in this.lights.
    const t = graphics_state.animation_time / 1000,
        dt = graphics_state.animation_delta_time / 1000;
    let identity = Mat4.identity();
    let model_transform = identity.times(Mat4.translation([0,-3,0])).times(Mat4.rotation(-Math.PI/2,[1,0,0])).times(Mat4.scale([8,8,5]));
   // this.shapes.cylinder_mod.draw(graphics_state,model_transform,this.materials.tent);
    model_transform = identity.times(Mat4.translation([0,2.5,0])).times(Mat4.rotation(-Math.PI/2,[1,0,0])).times(Mat4.scale([10,10,3]));
    //this.shapes.cone.draw(graphics_state,model_transform,this.materials.tent);
    this.shapes.balloon.draw(graphics_state,identity,this.materials.balloon);


    }
};
